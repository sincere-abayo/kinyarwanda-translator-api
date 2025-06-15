const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Enhanced Language codes mapping
const LANGUAGE_CODES = {
  'english': 'en',
  'kinyarwanda': 'rw',
  'french': 'fr',
  'swahili': 'sw',
  'en': 'en',
  'rw': 'rw',
  'fr': 'fr',
  'sw': 'sw'
};
// 🎯 UPDATED DICTIONARY - Remove problematic partial matches
const BASIC_DICTIONARY = {
  // English to Kinyarwanda - ONLY single words and short phrases
  'en_to_rw': {
    'hello': 'muraho',
    'hi': 'muraho',
    'thank you': 'murakoze',
    'thanks': 'murakoze',
    'good morning': 'mwaramutse',
    'good afternoon': 'mwiriwe',
    'good evening': 'mugoroba mwiza',
    'goodbye': 'murabeho',
    'bye': 'murabeho',
    'how are you': 'mumeze mute',
    'how are you?': 'mumeze mute?',
    'yes': 'yego',
    'no': 'oya',
    'please': 'nyamuneka',
    'excuse me': 'mumbabarire',
    'sorry': 'mumbabarire',
    'water': 'amazi',
    'food': 'ibiryo',
    'house': 'inzu',
    'home': 'inzu',
    'school': 'ishuri',
    'friend': 'inshuti',
    'family': 'umuryango',
    'mother': 'mama',
    'father': 'papa',
    'child': 'umwana',
    'children': 'abana',
    'man': 'umugabo',
    'woman': 'umugore',
    'person': 'umuntu',
    'people': 'abantu',
    'money': 'amafaranga',
    'work': 'akazi',
    'time': 'igihe',
    'day': 'umunsi',
    'night': 'ijoro',
    'morning': 'igitondo',
    'afternoon': 'nyuma ya saa sita',
    'evening': 'umugoroba',
    'today': 'uyu munsi',
    'tomorrow': 'ejo',
    'yesterday': 'ejo hashize',
    'week': 'icyumweru',
    'month': 'ukwezi',
    'year': 'umwaka',
    'love': 'urukundo',
    'peace': 'amahoro',
    'happiness': 'ibyishimo',
    'life': 'ubuzima',
    'god': 'imana',
    'church': 'itorero',
    'book': 'igitabo',
    'car': 'imodoka',
    'road': 'umuhanda',
    'city': 'umujyi',
    'country': 'igihugu',
    'rwanda': 'u rwanda'
  },
  
  // Kinyarwanda to English - ONLY single words and short phrases
  'rw_to_en': {
    'muraho': 'hello',
    'murakoze': 'thank you',
    'murakoze cyane': 'thank you very much',
    'mwaramutse': 'good morning',
    'mwiriwe': 'good afternoon',
    'mugoroba mwiza': 'good evening',
    'murabeho': 'goodbye',
    'mumeze mute': 'how are you',
    'mumeze mute?': 'how are you?',
    'yego': 'yes',
    'oya': 'no',
    'nyamuneka': 'please',
    'mumbabarire': 'excuse me',
    'amazi': 'water',
    'ibiryo': 'food',
    'inzu': 'house',
    'ishuri': 'school',
    'inshuti': 'friend',
    'umuryango': 'family',
    'mama': 'mother',
    'papa': 'father',
    'umwana': 'child',
    'abana': 'children',
    'umugabo': 'man',
    'umugore': 'woman',
    'umuntu': 'person',
    'abantu': 'people',
    'amafaranga': 'money',
    'akazi': 'work',
    'igihe': 'time',
    'umunsi': 'day',
    'ijoro': 'night',
    'igitondo': 'morning',
    'umugoroba': 'evening',
    'uyu munsi': 'today',
    'ejo': 'tomorrow',
    'ejo hashize': 'yesterday',
    'icyumweru': 'week',
    'ukwezi': 'month',
    'umwaka': 'year',
    'urukundo': 'love',
    'amahoro': 'peace',
    'ibyishimo': 'happiness',
    'ubuzima': 'life',
    'imana': 'god',
    'itorero': 'church',
    'igitabo': 'book',
    'imodoka': 'car',
    'umuhanda': 'road',
    'umujyi': 'city',
    'igihugu': 'country',
    'u rwanda': 'rwanda',
    'ndagukunda': 'i love you',
    'mfite ikibazo': 'i have a problem'
  }
};
// 🎯 FIXED TRANSLATION FUNCTION - Handles Multi-word Sentences
async function translateWithDictionary(text, sourceLang, targetLang) {
  const cleanText = text.toLowerCase().trim();
  const dictionaryKey = `${sourceLang}_to_${targetLang}`;
  
  // 1. Check if it's a SINGLE WORD/PHRASE in dictionary (exact match only for short text)
  if (BASIC_DICTIONARY[dictionaryKey] && BASIC_DICTIONARY[dictionaryKey][cleanText]) {
    // Only use dictionary for single words or short phrases (less than 4 words)
    const wordCount = cleanText.split(/\s+/).length;
    if (wordCount <= 3) {
      return {
        translatedText: BASIC_DICTIONARY[dictionaryKey][cleanText],
        match: 1.0,
        quality: 100,
        source: 'dictionary'
      };
    }
  }
  
  // 2. For longer sentences, try HYBRID approach (dictionary + API)
  if (cleanText.split(/\s+/).length > 3) {
    return await translateLongSentence(text, sourceLang, targetLang);
  }
  
  // 3. Check for partial matches in dictionary (for phrases only)
  if (BASIC_DICTIONARY[dictionaryKey]) {
    for (const [key, value] of Object.entries(BASIC_DICTIONARY[dictionaryKey])) {
      if (cleanText === key) { // Exact match only
        return {
          translatedText: value,
          match: 1.0,
          quality: 100,
          source: 'dictionary'
        };
      }
    }
  }
  
  // 4. Fall back to MyMemory API for everything else
  return await translateWithAPI(text, sourceLang, targetLang);
}

// 🎯 NEW FUNCTION: Handle Long Sentences with Hybrid Approach
async function translateLongSentence(text, sourceLang, targetLang) {
  try {
    // For long sentences, always use API to maintain context
    return await translateWithAPI(text, sourceLang, targetLang);
  } catch (error) {
    // If API fails, try word-by-word dictionary lookup as last resort
    return await translateWordByWord(text, sourceLang, targetLang);
  }
}

// 🎯 NEW FUNCTION: Pure API Translation
async function translateWithAPI(text, sourceLang, targetLang) {
  try {
    const langPair = `${sourceLang}|${targetLang}`;
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: langPair
      },
      timeout: 10000
    });

    if (response.data && response.data.responseData) {
      return {
        translatedText: response.data.responseData.translatedText,
        match: response.data.responseData.match || 0.8,
        quality: response.data.matches ? response.data.matches[0]?.quality || 70 : 70,
        source: 'api'
      };
    } else {
      throw new Error('Invalid response from MyMemory API');
    }
  } catch (error) {
    console.error('API Translation Error:', error.message);
    throw error;
  }
}

// 🎯 NEW FUNCTION: Word-by-Word Fallback (Emergency Only)
async function translateWordByWord(text, sourceLang, targetLang) {
  const dictionaryKey = `${sourceLang}_to_${targetLang}`;
  const words = text.toLowerCase().split(/\s+/);
  const translatedWords = [];
  
  for (const word of words) {
    // Clean word (remove punctuation)
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    
    if (BASIC_DICTIONARY[dictionaryKey] && BASIC_DICTIONARY[dictionaryKey][cleanWord]) {
      translatedWords.push(BASIC_DICTIONARY[dictionaryKey][cleanWord]);
    } else {
      // Keep original word if not in dictionary
      translatedWords.push(word);
    }
  }
  
  return {
    translatedText: translatedWords.join(' '),
    match: 0.6,
    quality: 60,
    source: 'dictionary_word_by_word'
  };
}




// Routes (keep your existing routes but update the translation function)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Enhanced Kinyarwanda Translation API is running',
    features: ['Dictionary lookup', 'API fallback', 'Improved accuracy'],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/languages', (req, res) => {
  res.json({
    supportedLanguages: {
      'en': 'English',
      'rw': 'Kinyarwanda',
      'fr': 'French',
      'sw': 'Swahili'
    },
    dictionarySupport: {
      'en-rw': 'Full dictionary support',
      'rw-en': 'Full dictionary support',
      'others': 'API-based translation'
    }
  });
});

// 🎯 UPDATED MAIN TRANSLATION ENDPOINT
app.post('/api/translate', async (req, res) => {
  try {
    const { text, source, target } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Text is required and cannot be empty' 
      });
    }

    if (text.length > 500) {
      return res.status(400).json({ 
        error: 'Text too long. Maximum 500 characters allowed.' 
      });
    }

    const sourceLang = LANGUAGE_CODES[source?.toLowerCase()] || 'en';
    const targetLang = LANGUAGE_CODES[target?.toLowerCase()] || 'rw';

    if (!LANGUAGE_CODES[sourceLang] || !LANGUAGE_CODES[targetLang]) {
      return res.status(400).json({ 
        error: 'Unsupported language. Use /api/languages to see supported languages.' 
      });
    }

    if (sourceLang === targetLang) {
      return res.status(400).json({ 
        error: 'Source and target languages cannot be the same' 
      });
    }

    // Use enhanced translation with dictionary
    const result = await translateWithDictionary(text, sourceLang, targetLang);

    res.json({
      success: true,
      originalText: text,
      translatedText: result.translatedText,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      translationQuality: result.quality,
      match: result.match,
      translationSource: result.source, // 'dictionary', 'api', or 'error'
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Translation failed', 
      details: error.message 
    });
  }
});

// Keep your other existing endpoints...
app.post('/api/translate/to-kinyarwanda', async (req, res) => {
  try {
    const { text, source = 'en' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const sourceLang = LANGUAGE_CODES[source?.toLowerCase()] || 'en';
    const result = await translateWithDictionary(text, sourceLang, 'rw');

    res.json({
      success: true,
      english: sourceLang === 'en' ? text : null,
      kinyarwanda: result.translatedText,
      quality: result.quality,
      source: result.source
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Translation to Kinyarwanda failed', 
      details: error.message 
    });
  }
});

app.post('/api/translate/from-kinyarwanda', async (req, res) => {
  try {
    const { text, target = 'en' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const targetLang = LANGUAGE_CODES[target?.toLowerCase()] || 'en';
    const result = await translateWithDictionary(text, 'rw', targetLang);

    res.json({
      success: true,
      kinyarwanda: text,
      translated: result.translatedText,
      targetLanguage: targetLang,
      quality: result.quality,
      source: result.source
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Translation from Kinyarwanda failed', 
      details: error.message 
    });
  }
});

// Keep your existing error handling and 404 handler...
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/languages',
      'POST /api/translate',
      'POST /api/translate/to-kinyarwanda',
      'POST /api/translate/from-kinyarwanda'
    ]
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Enhanced Kinyarwanda Translation API running on port ${PORT}`);
  console.log(`📚 Dictionary entries loaded: ${Object.keys(BASIC_DICTIONARY.en_to_rw).length} EN→RW, ${Object.keys(BASIC_DICTIONARY.rw_to_en).length} RW→EN`);
  console.log(`🎯 Features: Dictionary lookup, API fallback, Improved accuracy`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});
