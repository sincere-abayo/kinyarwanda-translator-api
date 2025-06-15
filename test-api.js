const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Kinyarwanda Translation API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', health.data.message);

    // Test 2: Get languages
    console.log('\n2. Testing languages endpoint...');
    const languages = await axios.get(`${API_BASE}/api/languages`);
    console.log('✅ Supported languages:', Object.keys(languages.data.supportedLanguages));

    // Test 3: Translate to Kinyarwanda
    console.log('\n3. Testing translation to Kinyarwanda...');
    const toKinyarwanda = await axios.post(`${API_BASE}/api/translate/to-kinyarwanda`, {
      text: 'Hello, how are you?',
      source: 'en'
    });
    console.log('✅ English to Kinyarwanda:');
    console.log(`   "${toKinyarwanda.data.english || 'Hello, how are you?'}" → "${toKinyarwanda.data.kinyarwanda}"`);

    // Test 4: General translation
    console.log('\n4. Testing general translation...');
    const general = await axios.post(`${API_BASE}/api/translate`, {
      text: 'Good morning',
      source: 'en',
      target: 'rw'
    });
    console.log('✅ General translation:');
    console.log(`   "${general.data.originalText}" → "${general.data.translatedText}"`);

    // Test 5: From Kinyarwanda
    console.log('\n5. Testing translation from Kinyarwanda...');
    const fromKinyarwanda = await axios.post(`${API_BASE}/api/translate/from-kinyarwanda`, {
      text: 'Muraho',
      target: 'en'
    });
    console.log('✅ Kinyarwanda to English:');
    console.log(`   "${fromKinyarwanda.data.kinyarwanda}" → "${fromKinyarwanda.data.translated}"`);

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();