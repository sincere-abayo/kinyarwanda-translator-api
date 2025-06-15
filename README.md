# Kinyarwanda Translation API

A free translation API supporting Kinyarwanda language using MyMemory translation service.

## Features

- ✅ Free to use (no API keys required)
- 🌍 Supports English ↔ Kinyarwanda translation
- 🚀 Easy to deploy and use
- 📝 RESTful API design
- ⚡ Fast response times

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Test the API:**
   ```bash
   npm test
   ```

## API Endpoints

### Health Check
```
GET /health
```

### Get Supported Languages
```
GET /api/languages
```

### General Translation
```
POST /api/translate
Content-Type: application/json

{
  "text": "Hello world",
  "source": "en",
  "target": "rw"
}
```

### Quick Translate to Kinyarwanda
```
POST /api/translate/to-kinyarwanda
Content-Type: application/json

{
  "text": "Good morning",
  "source": "en"
}
```

### Quick Translate from Kinyarwanda
```
POST /api/translate/from-kinyarwanda
Content-Type: application/json

{
  "text": "Muraho",
  "target": "en"
}
```

## Usage Examples

### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:3000/api/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'How are you?',
    source: 'en',
    target: 'rw'
  })
});

const result = await response.json();
console.log(result.translatedText);
```

### Python
```python
import requests

response = requests.post('http://localhost:3000/api/translate', json={
    'text': 'How are you?',
    'source': 'en',
    'target': 'rw'
})

print(response.json()['translatedText'])
```

### cURL
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","source":"en","target":"rw"}'
```

## Deployment

Deploy to Heroku, Railway, or any Node.js hosting service.

## Limitations

- MyMemory API has daily limits (1000 words/day for free)
- Translation quality may vary
- Internet connection required

## License

MIT License
```

## 8. Start the server

```bash
npm run dev
```

## 9. Test the API

```bash
npm test