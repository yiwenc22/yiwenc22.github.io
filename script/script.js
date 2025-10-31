const body = document.body;
const btnTheme = document.querySelector('.fa-moon');
const btnHamburger = document.querySelector('.fa-bars');

// Set default to dark theme
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'dark');
}

// Check if the user has a theme preference
const theme = localStorage.getItem('theme');
if (theme === 'dark') {
  body.classList.replace('light', 'dark');
  btnTheme.classList.replace('fa-moon', 'fa-sun');
}

// Switch theme function
const changeTheme = () => {
  if (body.classList.contains('light')) {
    body.classList.replace('light', 'dark');
    btnTheme.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.replace('dark', 'light');
    btnTheme.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
};

// Responsive navigation menu
const openMenu = () => {
  const navList = document.querySelector('.nav__list');
  if (!navList.classList.contains('display-nav-list')) {
    navList.classList.add('display-nav-list');
    btnHamburger.classList.replace('fa-bars', 'fa-times');
  } else {
    navList.classList.remove('display-nav-list');
    btnHamburger.classList.replace('fa-times', 'fa-bars');
  }
};

// Event listeners
btnTheme.addEventListener('click', changeTheme);
btnHamburger.addEventListener('click', openMenu);

// Scroll to top functionality
const scrollUp = document.querySelector('.scroll-top');
if (scrollUp) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
      scrollUp.style.display = 'block';
    } else {
      scrollUp.style.display = 'none';
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// AI Chat Interface
const aiChatToggle = document.getElementById('aiChatToggle');
const aiChatWindow = document.getElementById('aiChatWindow');
const aiChatClose = document.getElementById('aiChatClose');
const aiChatSend = document.getElementById('aiChatSend');
const aiChatInput = document.getElementById('aiChatInput');
const aiChatMessages = document.getElementById('aiChatMessages');
const aiChatBadge = document.querySelector('.ai-chat-badge');

// Toggle chat window
if (aiChatToggle) {
  aiChatToggle.addEventListener('click', () => {
    aiChatWindow.classList.toggle('active');
    if (aiChatWindow.classList.contains('active')) {
      aiChatBadge.style.display = 'none';
      aiChatInput.focus();
    }
  });
}

// Close chat window
if (aiChatClose) {
  aiChatClose.addEventListener('click', () => {
    aiChatWindow.classList.remove('active');
  });
}

// Chat Configuration
// Load from window.CHAT_CONFIG (set in chat-config.js) or use defaults
const CHAT_CONFIG = window.CHAT_CONFIG || {
  apiEndpoint: '',
  apiMethod: 'POST',
  useOpenAIFormat: false,
  apiKey: '',
  systemPrompt: `You are a helpful AI assistant representing Yiwen Chen, an AI Engineer & XR Specialist. 
    Help visitors learn about Yiwen's portfolio, projects, skills, and experience. 
    Be friendly, professional, and informative. Keep responses concise and relevant to the portfolio.`,
  maxHistory: 10,
  temperature: 0.7,
  model: 'gpt-3.5-turbo',
  useFallback: true
};

// Conversation history
let conversationHistory = [];

// Send message function with API integration
async function sendMessage(message) {
  if (!message.trim()) return;
  
  // Set status to online when sending message
  const aiStatus = document.querySelector('.ai-status');
  if (aiStatus) {
    aiStatus.textContent = 'Online';
    aiStatus.classList.remove('ai-status-offline');
    aiStatus.classList.add('ai-status-online');
  }
  
  // Disable input while processing
  aiChatInput.disabled = true;
  aiChatSend.disabled = true;
  
  // Add user message to UI
  const userMessage = document.createElement('div');
  userMessage.className = 'ai-message ai-message-user';
  userMessage.innerHTML = `
    <div class="ai-message-content">
      <p>${escapeHtml(message)}</p>
    </div>
  `;
  aiChatMessages.appendChild(userMessage);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  
  // Add to conversation history
  conversationHistory.push({ role: 'user', content: message });
  
  // Show typing indicator
  const typingIndicator = showTypingIndicator();
  
  try {
    let responseText;
    
    // Try API call if configured
    if (CHAT_CONFIG.apiEndpoint) {
      responseText = await callChatAPI(message);
    } else if (CHAT_CONFIG.useFallback) {
      // Use fallback responses
      responseText = getFallbackResponse(message);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
    } else {
      throw new Error('No API endpoint configured');
    }
    
    // Remove typing indicator
    typingIndicator.remove();
    
    // Add bot response
    const botMessage = document.createElement('div');
    botMessage.className = 'ai-message ai-message-bot';
    
    // Check if response is the "hasn't paid" message
    const isSadResponse = responseText.includes("hasn't paid me enough");
    const headClass = isSadResponse ? 'ai-head-3d ai-head-sad' : 'ai-head-3d';
    
    botMessage.innerHTML = `
      <div class="ai-message-avatar">
        <div class="${headClass}"></div>
      </div>
      <div class="ai-message-content">
        <p>${escapeHtml(responseText)}</p>
      </div>
    `;
    aiChatMessages.appendChild(botMessage);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    
    // Add to conversation history
    conversationHistory.push({ role: 'assistant', content: responseText });
    
    // Animate head - sad or normal
    const head = botMessage.querySelector('.ai-head-3d');
    if (isSadResponse) {
      head.style.animation = 'head-bob-sad 0.5s ease-in-out 2';
    } else {
      head.style.animation = 'head-bob 0.3s ease-in-out 3';
    }
    
    // Set status to offline after response
    setTimeout(() => {
      const aiStatus = document.querySelector('.ai-status');
      if (aiStatus) {
        aiStatus.textContent = 'Offline';
        aiStatus.classList.remove('ai-status-online');
        aiStatus.classList.add('ai-status-offline');
      }
    }, 500);
    
  } catch (error) {
    // Remove typing indicator
    typingIndicator.remove();
    
    // Show error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'ai-message ai-message-bot';
    errorMessage.innerHTML = `
      <div class="ai-message-avatar">
        <div class="ai-head-3d"></div>
      </div>
      <div class="ai-message-content ai-message-error">
        <p>Sorry, I'm having trouble connecting. ${error.message || 'Please try again later.'}</p>
      </div>
    `;
    aiChatMessages.appendChild(errorMessage);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    
    console.error('Chat API Error:', error);
  } finally {
    // Re-enable input
    aiChatInput.disabled = false;
    aiChatSend.disabled = false;
    aiChatInput.focus();
  }
}

// Call Chat API
async function callChatAPI(message) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add API key if using OpenAI format
  if (CHAT_CONFIG.useOpenAIFormat && CHAT_CONFIG.apiKey) {
    headers['Authorization'] = `Bearer ${CHAT_CONFIG.apiKey}`;
  }
  
  // Prepare messages for context
  const messages = [];
  
  // Add system prompt
  if (CHAT_CONFIG.systemPrompt) {
    messages.push({ role: 'system', content: CHAT_CONFIG.systemPrompt });
  }
  
  // Add recent conversation history (last N messages)
  const recentHistory = conversationHistory.slice(-CHAT_CONFIG.maxHistory);
  messages.push(...recentHistory);
  
  // Add current message
  messages.push({ role: 'user', content: message });
  
  // Prepare request body
  let requestBody;
  if (CHAT_CONFIG.useOpenAIFormat) {
    requestBody = {
      model: CHAT_CONFIG.model,
      messages: messages,
      temperature: CHAT_CONFIG.temperature,
      stream: false
    };
  } else {
    // Custom API format - adjust based on your API
    requestBody = {
      message: message,
      history: recentHistory,
      context: {
        systemPrompt: CHAT_CONFIG.systemPrompt
      }
    };
  }
  
  // Make API call
  const response = await fetch(CHAT_CONFIG.apiEndpoint, {
    method: CHAT_CONFIG.apiMethod,
    headers: headers,
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Parse response based on format
  if (CHAT_CONFIG.useOpenAIFormat) {
    return data.choices[0].message.content.trim();
  } else {
    // Custom API format - adjust based on your API response structure
    return data.response || data.message || data.text || JSON.stringify(data);
  }
}

// Fallback response generator (when API is not available)
function getFallbackResponse(message) {
  return "Yiwen hasn't paid me enough for this.";
}

// Show typing indicator
function showTypingIndicator() {
  const typingMessage = document.createElement('div');
  typingMessage.className = 'ai-message ai-message-bot ai-typing';
  typingMessage.innerHTML = `
    <div class="ai-message-avatar">
      <div class="ai-head-3d"></div>
    </div>
    <div class="ai-message-content">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  aiChatMessages.appendChild(typingMessage);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  return typingMessage;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Send button click
if (aiChatSend) {
  aiChatSend.addEventListener('click', () => {
    const message = aiChatInput.value;
    sendMessage(message);
    aiChatInput.value = '';
  });
}

// Enter key to send
if (aiChatInput) {
  aiChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const message = aiChatInput.value;
      sendMessage(message);
      aiChatInput.value = '';
    }
  });
}