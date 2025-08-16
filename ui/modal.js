// ui/modal.js

/**
 * Shows a modal with the list of prompts.
 * @param {string} platform - 'chatgpt', 'perplexity', or 'gemini'
 * @param {Array} userMessages - Array of DOM elements representing user prompts/messages
 * @param {Function} extractMessageText - function(messageElement) => string
 * @param {Function} onPromptClick - called with the index of the prompt clicked
 */
export function showPromptsModal(platform, userMessages, extractMessageText, onPromptClick) {
  // Remove any existing modal
  const existingModal = document.getElementById('thread-prompts-modal');
  if (existingModal) existingModal.remove();

  // Create modal backdrop
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

  // Platform-specific color for prompt numbers
  const colors = {
    chatgpt: '#10a37f',
    perplexity: '#20a4f3',
    gemini: '#4285f4'
  };

  // Platform display names
  const platformNames = {
    chatgpt: 'ChatGPT',
    perplexity: 'Perplexity',
    gemini: 'Gemini'
  };

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
    display: flex;
    flex-direction: column;
  `;

  // Modal header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 15px 20px; 
    border-bottom: 1px solid #e5e5e5; 
    background: #f8f9fa;
    border-radius: 12px 12px 0 0;
  `;
  const title = document.createElement('h3');
  title.textContent = `${platformNames[platform]} Prompts (${userMessages.length})`;
  title.style.cssText = 'margin: 0; color: #333; font-size: 18px;';
  const closeBtn = document.createElement('button');
  closeBtn.id = 'close-prompts';
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    background: none; 
    border: none; 
    font-size: 24px; 
    cursor: pointer; 
    color: #666; 
    padding: 0; 
    width: 30px; 
    height: 30px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; transition: background-color 0.2s;
  `;
  closeBtn.onmouseenter = () => { closeBtn.style.background = '#e9ecef'; };
  closeBtn.onmouseleave = () => { closeBtn.style.background = 'none'; };
  closeBtn.onclick = () => modal.remove();
  header.append(title, closeBtn);
  modalContent.appendChild(header);

  // Modal prompt list
  const promptList = document.createElement('div');
  promptList.style.cssText = `
    padding: 20px; 
    overflow-y: auto; 
    max-height: 60vh;
    background: white;
    border-radius: 0 0 12px 12px;
    flex: 1;
  `;

  if (userMessages.length === 0) {
    const noPrompt = document.createElement('p');
    noPrompt.textContent = 'No prompts found in this thread.';
    noPrompt.style.cssText = 'text-align: center; color: #666; font-style: italic;';
    promptList.appendChild(noPrompt);
  } else {
    userMessages.forEach((message, index) => {
      const text = extractMessageText(message, platform);
      const truncatedText = text.length > 100 ? text.substring(0, 100) + '...' : text;

      const promptItem = document.createElement('div');
      promptItem.className = 'prompt-item';
      promptItem.style.cssText = `
        display: flex;
        align-items: flex-start;
        padding: 12px;
        margin-bottom: 8px;
        background: #f8f9fa;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      `;

      // Prompt number bubble
      const numberBubble = document.createElement('div');
      numberBubble.style.cssText = `
        background: ${colors[platform]};
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
      `;
      numberBubble.textContent = (index + 1);

      // Prompt text
      const promptTextDiv = document.createElement('div');
      promptTextDiv.textContent = truncatedText;
      promptTextDiv.title = text;
      promptTextDiv.style.cssText = 'flex: 1; line-height: 1.4; color: #333; font-size: 14px; white-space: pre-wrap;';

      // Add interactivity
      promptItem.onmouseenter = function() {
        promptItem.style.background = '#e9ecef';
        promptItem.style.borderColor = colors[platform];
      };
      promptItem.onmouseleave = function() {
        promptItem.style.background = '#f8f9fa';
        promptItem.style.borderColor = 'transparent';
      };
      promptItem.onclick = function() {
        onPromptClick(index); // Scroll and highlight logic should be handled in onPromptClick
        modal.remove();
      };

      promptItem.append(numberBubble, promptTextDiv);
      promptList.appendChild(promptItem);
    });
  }

  modalContent.appendChild(promptList);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Allow closing modal by clicking outside content
  modal.onclick = function(e) {
    if (e.target === modal) modal.remove();
  };
}
