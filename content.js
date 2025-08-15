// Wait for page to fully load and check multiple times
let retryCount = 0;
const maxRetries = 10;

// Platform detection
function getCurrentPlatform() {
  const url = window.location.href;
  if (url.includes('chatgpt.com') || url.includes('chat.openai.com')) {
    return 'chatgpt';
  } else if (url.includes('perplexity.ai')) {
    return 'perplexity';
  } else if (url.includes('gemini.google.com')) {
    return 'gemini';
  }
  return null;
}

function initExtension() {
  const platform = getCurrentPlatform();
  console.log(`Thread Navigator: Attempting to initialize on ${platform}...`);
  
  if (!platform) {
    console.log('Thread Navigator: Not on supported platform');
    return;
  }

  // Check if button already exists
  if (document.getElementById('thread-navigator-btn')) {
    console.log('Thread Navigator: Button already exists');
    return;
  }

  // Create the floating button
  createFloatingButton(platform);
  console.log(`Thread Navigator: Button created successfully for ${platform}`);
}

function createFloatingButton(platform) {
  const floatingButton = document.createElement('div');
  floatingButton.id = 'thread-navigator-btn';
  floatingButton.innerHTML = '📋';
  floatingButton.title = `Show ${platform} thread prompts`;
  
  // Platform-specific colors
  const colors = {
    chatgpt: 'linear-gradient(135deg, #10a37f, #0d8b6b)',
    perplexity: 'linear-gradient(135deg, #20a4f3, #1976d2)',
    gemini: 'linear-gradient(135deg, #4285f4, #1565c0)'
  };
  
  // Force styles to ensure visibility
  floatingButton.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    right: 20px !important;
    width: 50px !important;
    height: 50px !important;
    background: ${colors[platform]} !important;
    color: white !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 20px !important;
    cursor: pointer !important;
    z-index: 999999 !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
    transition: all 0.3s ease !important;
    user-select: none !important;
    border: none !important;
    font-family: system-ui !important;
  `;

  // Add click handler
  floatingButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Thread Navigator: Button clicked on ${platform}`);
    showPromptsList(platform);
  });

  // Add hover effect
  floatingButton.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });
  
  floatingButton.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });

  document.body.appendChild(floatingButton);
  console.log(`Thread Navigator: Floating button added to ${platform} page`);
}

function showPromptsList(platform) {
  console.log(`Thread Navigator: Showing prompts list for ${platform}`);
  
  // Remove existing modal if any
  const existingModal = document.getElementById('thread-prompts-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal
  const modal = document.createElement('div');
  modal.id = 'thread-prompts-modal';
  modal.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(0, 0, 0, 0.5) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 1000000 !important;
  `;

  // Find user messages based on platform
  const userMessages = findUserMessages(platform);
  console.log(`Thread Navigator: Found ${userMessages.length} user messages on ${platform}`);

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white !important;
    border-radius: 12px !important;
    max-width: 600px !important;
    width: 90% !important;
    max-height: 70vh !important;
    overflow: hidden !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
  `;

  const platformNames = {
    chatgpt: 'ChatGPT',
    perplexity: 'Perplexity',
    gemini: 'Gemini'
  };

  let promptsHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #e5e5e5; background: #f8f9fa;">
      <h3 style="margin: 0; color: #333; font-size: 18px;">${platformNames[platform]} Prompts (${userMessages.length})</h3>
      <button id="close-prompts" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 0; width: 30px; height: 30px;">×</button>
    </div>
    <div style="padding: 20px; overflow-y: auto; max-height: 60vh;">
  `;

  if (userMessages.length === 0) {
    promptsHTML += '<p style="text-align: center; color: #666; font-style: italic;">No prompts found in this thread.</p>';
  } else {
    userMessages.forEach((message, index) => {
      const text = extractMessageText(message, platform);
      const truncatedText = text.length > 100 ? text.substring(0, 100) + '...' : text;
      
      promptsHTML += `
        <div class="prompt-item" data-index="${index}" style="
          display: flex;
          align-items: flex-start;
          padding: 12px;
          margin-bottom: 8px;
          background: #f8f9fa;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        ">
          <div style="
            background: ${platform === 'chatgpt' ? '#10a37f' : platform === 'perplexity' ? '#20a4f3' : '#4285f4'};
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            margin-right: 12px;
            flex-shrink: 0;
          ">${index + 1}</div>
          <div style="flex: 1; line-height: 1.4; color: #333; font-size: 14px;" title="${text}">${truncatedText}</div>
        </div>
      `;
    });
  }

  promptsHTML += '</div>';
  modalContent.innerHTML = promptsHTML;

  // Add click handlers
  modalContent.querySelectorAll('.prompt-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      scrollToMessage(userMessages[index]);
      modal.remove();
    });
    
    item.addEventListener('mouseenter', function() {
      this.style.background = '#e9ecef';
      this.style.borderColor = platform === 'chatgpt' ? '#10a37f' : platform === 'perplexity' ? '#20a4f3' : '#4285f4';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.background = '#f8f9fa';
      this.style.borderColor = 'transparent';
    });
  });

  // Close button
  modalContent.querySelector('#close-prompts').addEventListener('click', () => {
    modal.remove();
  });

  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

function findUserMessages(platform) {
  let selectors = [];
  let messages = [];

  switch (platform) {
    case 'chatgpt':
      selectors = [
        '[data-message-author-role="user"]',
        '[data-testid*="user"]',
        '.group.w-full:has([data-message-author-role="user"])',
        'div[class*="group"]:has(div[class*="avatar"]) + div:has(div[class*="markdown"])'
      ];
      break;
      
    case 'perplexity':
      selectors = [
        '[class*="UserMessage"]',
        '[class*="user-message"]',
        'div[class*="prose"]:has(div[class*="user"])',
        'div:has(> div[class*="border"]) div[class*="prose"]',
        'div[class*="mt-4"]:has(div[class*="prose"])',
        'div[data-testid*="user"]'
      ];
      break;
      
    case 'gemini':
      selectors = [
        '[data-test-id*="user"]',
        '[data-testid*="user"]',
        'div[class*="user-input"]',
        'div[class*="prompt-input"]',
        'div[jsname]:has(div[class*="formatted"])',
        'div[class*="conversation"]:has(div[class*="user"])',
        'div[role="button"]:has(span)',
        'div[class*="request-container"]'
      ];
      break;
  }

  // Try selectors specific to the platform
  for (const selector of selectors) {
    try {
      const found = document.querySelectorAll(selector);
      if (found.length > 0) {
        console.log(`Thread Navigator: Found messages with selector for ${platform}:`, selector);
        messages = Array.from(found);
        break;
      }
    } catch (e) {
      console.log(`Thread Navigator: Selector failed for ${platform}:`, selector, e);
    }
  }

  // Platform-specific fallback detection
  if (messages.length === 0) {
    console.log(`Thread Navigator: Trying alternative detection method for ${platform}`);
    
    switch (platform) {
      case 'perplexity':
        // Look for elements that contain user queries (typically before AI responses)
        const perplexityElements = document.querySelectorAll('div[class*="prose"], div[class*="markdown"]');
        messages = Array.from(perplexityElements).filter(el => {
          const text = el.textContent.trim();
          const parent = el.closest('div[class*="border"], div[class*="rounded"]');
          return text && 
                 text.length > 5 && 
                 text.length < 2000 && 
                 !text.includes('Sources') &&
                 !text.includes('Related') &&
                 parent &&
                 !text.startsWith('Answer:') &&
                 !text.startsWith('Response:');
        });
        break;
        
      case 'gemini':
        // Look for user input containers
        const geminiElements = document.querySelectorAll('div[class*="conversation"], div[jsname], div[class*="formatted"]');
        messages = Array.from(geminiElements).filter(el => {
          const text = el.textContent.trim();
          return text && 
                 text.length > 5 && 
                 text.length < 2000 && 
                 !text.includes('Gemini') &&
                 !text.includes('Google') &&
                 el.querySelector('span, p, div') &&
                 !el.querySelector('svg, img');
        });
        break;
        
      case 'chatgpt':
        // Fallback for ChatGPT
        const chatgptElements = document.querySelectorAll('div');
        messages = Array.from(chatgptElements).filter(div => {
          const text = div.textContent;
          return text && 
                 text.length > 10 && 
                 text.length < 5000 && 
                 !text.includes('ChatGPT') &&
                 !text.includes('Copy code') &&
                 div.children.length < 10;
        });
        break;
    }
  }

  // Filter out likely false positives
  messages = messages.filter(msg => {
    const text = msg.textContent.trim();
    return text.length > 3 && 
           !text.match(/^(Copy|Share|Edit|Delete|Regenerate)$/i) &&
           !text.match(/^\d+$/) &&
           !text.includes('undefined');
  });

  return messages;
}

function extractMessageText(messageElement, platform) {
  let textElement;
  
  switch (platform) {
    case 'chatgpt':
      textElement = messageElement.querySelector('.whitespace-pre-wrap') ||
                   messageElement.querySelector('[class*="markdown"]') ||
                   messageElement.querySelector('p') ||
                   messageElement;
      break;
      
    case 'perplexity':
      textElement = messageElement.querySelector('[class*="prose"] p') ||
                   messageElement.querySelector('p') ||
                   messageElement.querySelector('div[class*="markdown"]') ||
                   messageElement;
      break;
      
    case 'gemini':
      textElement = messageElement.querySelector('span') ||
                   messageElement.querySelector('p') ||
                   messageElement.querySelector('div[class*="formatted"]') ||
                   messageElement;
      break;
      
    default:
      textElement = messageElement;
  }
  
  return textElement ? textElement.textContent.trim() : 'Unable to extract text';
}

function scrollToMessage(messageElement) {
  if (messageElement) {
    messageElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Highlight the message
    const originalStyle = messageElement.style.cssText;
    messageElement.style.cssText += `
      background-color: #fff3cd !important;
      border: 2px solid #ffc107 !important;
      border-radius: 8px !important;
      transition: all 0.3s ease !important;
    `;
    
    setTimeout(() => {
      messageElement.style.cssText = originalStyle;
    }, 2000);
  }
}

// Initialize with multiple retry attempts
function tryInit() {
  retryCount++;
  const platform = getCurrentPlatform();
  console.log(`Thread Navigator: Attempt ${retryCount}/${maxRetries} on ${platform}`);
  
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initExtension();
  } else if (retryCount < maxRetries) {
    setTimeout(tryInit, 1000);
  }
}

// Start initialization
console.log('Thread Navigator: Script loaded');
tryInit();

// Also try when DOM changes (for single-page app navigation)
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    const hasNewContent = mutations.some(mutation => 
      mutation.addedNodes.length > 0 || 
      mutation.type === 'childList'
    );
    
    if (hasNewContent && !document.getElementById('thread-navigator-btn')) {
      setTimeout(initExtension, 1500);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Handle navigation in single-page applications
let currentUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    console.log('Thread Navigator: URL changed, reinitializing...');
    setTimeout(() => {
      const existingButton = document.getElementById('thread-navigator-btn');
      if (existingButton) {
        existingButton.remove();
      }
      retryCount = 0;
      initExtension();
    }, 2000);
  }
}, 1000);
