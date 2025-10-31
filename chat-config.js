// Chat API Configuration
// Update this file with your API endpoint and settings
// This config will be automatically loaded by script.js

// If you want to override the config, define window.CHAT_CONFIG before loading script.js
window.CHAT_CONFIG = window.CHAT_CONFIG || {
  // ==========================================
  // API Configuration
  // ==========================================
  
  // Option 1: Use your own backend API endpoint
  // Example: 'https://your-backend.com/api/chat'
  // Or use a relative path if same domain: '/api/chat'
  apiEndpoint: '', // SET YOUR API ENDPOINT HERE
  
  // HTTP method for API calls
  apiMethod: 'POST',
  
  // ==========================================
  // OpenAI Compatible API (Optional)
  // ==========================================
  // Set to true if your API follows OpenAI's format
  useOpenAIFormat: false,
  
  // API Key (if needed - for OpenAI format)
  // NOTE: Never expose API keys in frontend code for production!
  // Use a backend proxy instead
  apiKey: '', // SET YOUR API KEY HERE IF NEEDED
  
  // ==========================================
  // Chat Settings
  // ==========================================
  
  // System prompt that defines the AI's behavior
  systemPrompt: `You are a helpful AI assistant representing Yiwen Chen, an AI Engineer & XR Specialist. 
    Help visitors learn about Yiwen's portfolio, projects, skills, and experience. 
    Be friendly, professional, and informative. Keep responses concise and relevant to the portfolio.`,
  
  // Number of previous messages to include for context
  maxHistory: 10,
  
  // Temperature (creativity) - 0.0 to 2.0
  temperature: 0.7,
  
  // Model name (if using OpenAI format)
  model: 'gpt-3.5-turbo', // Options: 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', etc.
  
  // ==========================================
  // Fallback Mode
  // ==========================================
  // If true, uses fallback responses when API is unavailable
  useFallback: true
};

