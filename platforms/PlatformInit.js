// platforms/platformInit.js

import * as chatgpt from './chatgpt.js';
import * as perplexity from './perplexity.js';
import * as gemini from './gemini.js';
import { showPromptsModal } from '../ui/modal.js';

const platforms = { chatgpt, perplexity, gemini };

/**
 * Initialize the navigator for the detected platform.
 * @param {string} platform - 'chatgpt', 'perplexity', or 'gemini'
 */
export function initPlatform(platform) {
  const { findUserMessages, extractMessageText } = platforms[platform];
  if (!findUserMessages || !extractMessageText) {
    console.warn(`Thread Navigator: No platform logic found for '${platform}'`);
    return;
  }
  const userMessages = findUserMessages();

  showPromptsModal(
    platform,
    userMessages,
    extractMessageText,
    (index) => {
      // Scroll logic:
      const msg = userMessages[index];
      if (msg) {
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight:
        const originalStyle = msg.style.cssText;
        msg.style.cssText += `
          background-color: #fff3cd !important;
          border: 2px solid #ffc107 !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        `;
        setTimeout(() => {
          msg.style.cssText = originalStyle;
        }, 2000);
      }
    }
  );
}
