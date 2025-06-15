// // Add this to your conversation-tester.js or create a new file

// const SENTENCE_TESTS = [
//   // Test cases for your specific examples
//   { rw: "Muraho neza mfite ibibazo byinshi cyane", expected_en: "Hello well I have many problems" },
//   { rw: "Muraho neza, mfite ibibazo byinshi cyane", expected_en: "Hello well, I have many problems" },
//   { rw: "Muraho neza. Mfite ibibazo byinshi cyane", expected_en: "Hello well. I have many problems" },
  
//   // Additional sentence tests
//   { rw: "Mwaramutse, mumeze mute uyu munsi?", expected_en: "Good morning, how are you today?" },
//   { rw: "Murakoze cyane kubufasha bwanyu", expected_en: "Thank you very much for your help" },
//   { rw: "Ndashaka kujya ku ishuri ejo", expected_en: "I want to go to school tomorrow" },
//   { rw: "Inshuti yanjye ni umuntu mwiza", expected_en: "My friend is a good person" },
  
//   // English to Kinyarwanda
//   { en: "Hello, how are you today?", expected_rw: "Muraho, mumeze mute uyu munsi?" },
//   { en: "Thank you for your help", expected_rw: "Murakoze kubufasha bwanyu" },
//   { en: "I want to go home now", expected_rw: "Ndashaka kujya mu rugo ubu" }
// ];

// // Add this method to your ConversationTester class
// async runSentenceTests() {
//   console.log('🧪 Running Sentence Structure Tests...');
  
//   for (const test of SENTENCE_TESTS) {
//     if (test.rw) {
//       const result = await this.testSingleSentence(test.rw, 'rw', 'en', test.expected_en);
//       console.log(`${result.passed ? '✅' : '❌'} RW→EN: "${test.rw}" → "${result.translation}"`);
//     }
    
//     if (test.en) {
//       const result = await this.testSingleSentence(test.en, 'en', 'rw', test.expected_rw);
//       console.log(`${result.passed ? '✅' : '❌'} EN→RW: "${test.en}" → "${result.translation}"`);
//     }
//   }
// }

// async testSingleSentence(text, source, target, expected) {
//   try {
//     const response = await fetch(`${this.apiBase}/api/translate`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text, source, target })
//     });
    
//     const data = await response.json();
    
//     return {
//       translation: data.translatedText,
//       passed: data.translatedText !== text.split(' ')[0], // Not just first word
//       quality: data.translationQuality,
//       source: data.translationSource
//     };
//   } catch (error) {
//     return {
//       translation: 'ERROR',
//       passed: false,
//       error: error.message
//     };
//   }
// }