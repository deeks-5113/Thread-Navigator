// platforms/chatgpt.js

/**
 * Find all user prompt elements in ChatGPT conversations.
 * @returns {Element[]}
 */
export function findUserMessages() {
  const selectors = [
    '[data-message-author-role="user"]',
    '[data-testid*="user"]',
    '.group.w-full:has([data-message-author-role="user"])',
    'div[class*="group"]:has(div[class*="avatar"]) + div:has(div[class*="markdown"])'
  ];
  let messages = [];

  for (const selector of selectors) {
    try {
      const found = document.querySelectorAll(selector);
      if (found.length > 0) {
        messages = Array.from(found);
        break;
      }
    } catch (e) {}
  }

  if (messages.length === 0) {
    // Fallback: filter generic divs
    const allDivs = document.querySelectorAll('div');
    messages = Array.from(allDivs).filter(div => {
      const text = div.textContent || "";
      return text.length > 10 && text.length < 5000 &&
        !text.includes('ChatGPT') &&
        !text.includes('Copy code') &&
        div.children.length < 10;
    });
  }
  // Filter out navigation/control items
  return messages.filter(msg => {
    const text = msg.textContent.trim();
    return text.length > 3 &&
      !/^(Copy|Share|Edit|Delete|Regenerate)$/i.test(text) &&
      !/^\d+$/.test(text) &&
      !text.includes('undefined');
  });
}

/**
 * Extract readable text from a ChatGPT user prompt element.
 * @param {Element} messageElement
 * @returns {string}
 */
export function extractMessageText(messageElement) {
  const textElement =
    messageElement.querySelector('.whitespace-pre-wrap') ||
    messageElement.querySelector('[class*="markdown"]') ||
    messageElement.querySelector('p') ||
    messageElement;
  return textElement ? textElement.textContent.trim() : '';
}
