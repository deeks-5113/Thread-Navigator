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
        max-width: 700px !important;
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
        <div class="prompts-header">
            <h3>${platformNames[platform]} Thread Navigator</h3>
            <button id="close-prompts-list">×</button>
        </div>
        <div class="prompts-content">
            <div id="prompts-container">
    `;

    if (userMessages.length === 0) {
        promptsHTML += '<div class="no-prompts">No prompts found in this thread.</div>';
    } else {
        userMessages.forEach((message, index) => {
            const text = extractMessageText(message, platform);
            const truncatedText = text.length > 100 ? text.substring(0, 100) + '...' : text;
            
            promptsHTML += `
                <div class="prompt-item" data-index="${index}">
                    <div class="prompt-number">${index + 1}</div>
                    <div class="prompt-text" title="${text}">${truncatedText}</div>
                    <div class="prompt-actions">
                        <button class="copy-response-btn" data-index="${index}" title="Copy AI Response">
                            📋
                        </button>
                        <button class="goto-response-btn" data-index="${index}" title="Go to AI Response">
                            🔗
                        </button>
                    </div>
                </div>
            `;
        });
    }

    promptsHTML += `
            </div>
        </div>
    `;

    modalContent.innerHTML = promptsHTML;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Add event listeners
    setupModalEventListeners(modal, platform, userMessages);
}

function setupModalEventListeners(modal, platform, userMessages) {
    // Close button
    const closeBtn = modal.querySelector('#close-prompts-list');
    closeBtn?.addEventListener('click', () => modal.remove());

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Prompt navigation (existing functionality)
    const promptItems = modal.querySelectorAll('.prompt-item');
    promptItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking on action buttons
            if (e.target.closest('.prompt-actions')) return;
            
            scrollToPrompt(userMessages[index]);
            modal.remove();
        });
    });

    // Copy response buttons
    const copyBtns = modal.querySelectorAll('.copy-response-btn');
    copyBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            copyAIResponse(userMessages[index], platform);
        });
    });

    // Go to response buttons
    const gotoBtns = modal.querySelectorAll('.goto-response-btn');
    gotoBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            goToAIResponse(userMessages[index], platform);
            modal.remove();
        });
    });
}

// Copy AI response to clipboard
async function copyAIResponse(userMessage, platform) {
    const aiResponse = findAIResponse(userMessage, platform);
    
    if (!aiResponse) {
        showNotification('❌ AI response not found', 'error');
        return;
    }

    const responseText = extractMessageText(aiResponse, platform);
    
    try {
        await navigator.clipboard.writeText(responseText);
        showNotification('✅ AI response copied to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        showNotification('❌ Failed to copy to clipboard', 'error');
    }
}

// Navigate to AI response
function goToAIResponse(userMessage, platform) {
    const aiResponse = findAIResponse(userMessage, platform);
    
    if (!aiResponse) {
        showNotification('❌ AI response not found', 'error');
        return;
    }

    scrollToElement(aiResponse);
    highlightElement(aiResponse);
    showNotification('📍 Navigated to AI response', 'success');
}

// Find the AI response that follows a user message
function findAIResponse(userMessage, platform) {
    let nextElement = userMessage.nextElementSibling;
    
    // Platform-specific logic to find AI responses
    switch (platform) {
        case 'chatgpt':
            // Look for the next message that's not from user
            while (nextElement) {
                if (nextElement.matches('[data-message-author-role="assistant"]') || 
                    nextElement.querySelector('[data-message-author-role="assistant"]')) {
                    return nextElement;
                }
                nextElement = nextElement.nextElementSibling;
            }
            break;
            
        case 'perplexity':
            // Look for AI response container
            while (nextElement) {
                if (nextElement.classList.contains('md:pb-9') || 
                    nextElement.querySelector('.bg-offsetPlus')) {
                    return nextElement;
                }
                nextElement = nextElement.nextElementSibling;
            }
            break;
            
        case 'gemini':
            // Look for model response
            while (nextElement) {
                if (nextElement.matches('[data-response-index]') ||
                    nextElement.querySelector('.model-response')) {
                    return nextElement;
                }
                nextElement = nextElement.nextElementSibling;
            }
            break;
    }
    
    return null;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `thread-navigator-notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        background: ${type === 'success' ? '#10a37f' : type === 'error' ? '#ff4444' : '#333'} !important;
        color: white !important;
        padding: 12px 20px !important;
        border-radius: 8px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        z-index: 1000001 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        animation: slideInFromRight 0.3s ease !important;
    `;

    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Helper functions for scrolling and highlighting
function scrollToElement(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function highlightElement(element) {
    const originalStyle = element.style.cssText;
    element.style.cssText += `
        background: rgba(255, 255, 0, 0.3) !important;
        border: 2px solid #ffd700 !important;
        border-radius: 8px !important;
        transition: all 0.3s ease !important;
    `;
    
    setTimeout(() => {
        element.style.cssText = originalStyle;
    }, 2000);
}

function scrollToPrompt(element) {
    scrollToElement(element);
    highlightElement(element);
}

// Platform-specific message detection
function findUserMessages(platform) {
    let messages = [];
    
    switch (platform) {
        case 'chatgpt':
            messages = Array.from(document.querySelectorAll('[data-message-author-role="user"]'))
                .map(el => el.closest('[data-testid^="conversation-turn"]') || el);
            break;
            
        case 'perplexity':
            messages = Array.from(document.querySelectorAll('.bg-offsetPlus, [role="button"]'))
                .filter(el => el.textContent.trim().length > 10);
            break;
            
        case 'gemini':
            messages = Array.from(document.querySelectorAll('[data-message-index]'))
                .filter(el => el.querySelector('.user-message') || el.matches('.user-message'));
            break;
    }
    
    return messages;
}

function extractMessageText(element, platform) {
    if (!element) return '';
    
    // Try to find the actual text content, avoiding buttons and UI elements
    const textElement = element.querySelector('.prose, .markdown, .message-content') || element;
    return textElement.textContent?.trim() || element.textContent?.trim() || '';
}

// Initialize when page loads
function initialize() {
    retryCount++;
    
    if (retryCount > maxRetries) {
        console.log('Thread Navigator: Max retries reached');
        return;
    }
    
    if (document.readyState === 'loading') {
        setTimeout(initialize, 500);
        return;
    }
    
    initExtension();
    
    // Also try again after a delay for dynamic content
    if (retryCount <= 3) {
        setTimeout(initialize, 2000);
    }
}

// Start initialization
initialize();

// Also listen for navigation changes
let currentURL = window.location.href;
const observer = new MutationObserver(() => {
    if (window.location.href !== currentURL) {
        currentURL = window.location.href;
        setTimeout(initExtension, 1000);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
