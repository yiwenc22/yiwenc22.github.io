# Chatbot API Integration Guide

This portfolio includes a fully functional AI chatbot that can connect to various API endpoints for real conversations.

## Features

- ✅ **Flexible API Integration** - Works with any REST API endpoint
- ✅ **OpenAI Compatible** - Supports OpenAI API format
- ✅ **Conversation History** - Maintains context across messages
- ✅ **Typing Indicators** - Shows when AI is thinking
- ✅ **Error Handling** - Graceful fallbacks and error messages
- ✅ **Fallback Mode** - Works without API (uses smart responses)

## Setup Instructions

### Option 1: Use Your Own Backend API (Recommended)

1. **Create your backend API endpoint** that accepts POST requests
   ```javascript
   // Example endpoint: https://your-api.com/api/chat
   POST /api/chat
   Body: {
     "message": "user message",
     "history": [...],
     "context": {...}
   }
   ```

2. **Update `chat-config.js`**:
   ```javascript
   const CHAT_CONFIG = {
     apiEndpoint: 'https://your-api.com/api/chat', // Your API URL
     apiMethod: 'POST',
     useOpenAIFormat: false,
     // ... other settings
   };
   ```

3. **Your API should return**:
   ```json
   {
     "response": "AI response text"
   }
   ```
   Or:
   ```json
   {
     "message": "AI response text"
   }
   ```
   Or:
   ```json
   {
     "text": "AI response text"
   }
   ```

### Option 2: Use OpenAI Compatible API

1. **Update `chat-config.js`**:
   ```javascript
   const CHAT_CONFIG = {
     apiEndpoint: 'https://api.openai.com/v1/chat/completions',
     useOpenAIFormat: true,
     apiKey: 'your-api-key-here',
     model: 'gpt-3.5-turbo',
     // ... other settings
   };
   ```

   ⚠️ **Security Note**: Never expose API keys in frontend code for production! Use a backend proxy instead.

### Option 3: Use Fallback Mode (No API Required)

If `apiEndpoint` is empty, the chatbot will use smart fallback responses based on keywords. This works out of the box without any configuration!

## Configuration Options

### `chat-config.js` Settings:

- **`apiEndpoint`**: Your API URL (leave empty for fallback mode)
- **`apiMethod`**: HTTP method (usually 'POST')
- **`useOpenAIFormat`**: Set to `true` if using OpenAI API format
- **`apiKey`**: API key (if needed - use backend proxy for security)
- **`systemPrompt`**: Defines the AI's personality and behavior
- **`maxHistory`**: Number of previous messages to include for context (default: 10)
- **`temperature`**: Creativity level 0.0-2.0 (default: 0.7)
- **`model`**: Model name (for OpenAI format, default: 'gpt-3.5-turbo')
- **`useFallback`**: Enable fallback mode when API unavailable (default: true)

## API Request Format

### Custom API Format (default):
```json
{
  "message": "user's message",
  "history": [
    {"role": "user", "content": "previous message"},
    {"role": "assistant", "content": "previous response"}
  ],
  "context": {
    "systemPrompt": "system prompt text"
  }
}
```

### OpenAI Format:
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {"role": "system", "content": "system prompt"},
    {"role": "user", "content": "message"},
    {"role": "assistant", "content": "response"}
  ],
  "temperature": 0.7,
  "stream": false
}
```

## Example Backend Implementation

### Python (Flask):
```python
from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    history = data.get('history', [])
    
    # Call your AI service here
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message}]
    )
    
    return jsonify({
        "response": response.choices[0].message.content
    })
```

### Node.js (Express):
```javascript
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  
  // Call your AI service here
  const response = await callAIService(message, history);
  
  res.json({ response });
});

app.listen(3000);
```

## Testing

1. **Without API**: Just refresh the page - fallback mode works immediately
2. **With API**: 
   - Update `chat-config.js` with your endpoint
   - Open browser console to see API calls
   - Test the chat interface

## Troubleshooting

- **CORS Issues**: Make sure your API allows requests from your domain
- **API Not Responding**: Check browser console for errors
- **Wrong Response Format**: Update `callChatAPI()` function in `script.js` to match your API
- **Fallback Not Working**: Ensure `useFallback: true` in config

## Security Best Practices

1. **Never expose API keys in frontend code**
2. **Use a backend proxy** to hide your API credentials
3. **Implement rate limiting** on your backend
4. **Validate and sanitize** user input
5. **Use HTTPS** for all API calls

## Need Help?

Check the browser console for detailed error messages. The chatbot will show user-friendly error messages if the API fails.

