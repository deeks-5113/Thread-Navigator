// platforms/gemini.js

/**
 * Find all user prompt elements in Gemini conversations.
 * @returns {Element[]}
 */
export function findUserMessages() {
  const selectors = [
    '[data-test-id*="user"]',
    '[data-testid*="user"]',
    'div[class*="user-input"]',
    'div[class*="prompt-input"]',
    'div[jsname]:has(div[class*="formatted"])',
    'div[class*="conversation"]:has(div[class*="user"])',
    'div[role="button"]:has(span)',
    'div[class*="request-container"]'
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
    // Fallback: look for likely user prompt blocks
    const allDivs = document.querySelectorAll('div[class*="conversation"], div[jsname], div[class*="formatted"]');
    messages = Array.from(allDivs).filter(el => {
      const text = el.textContent.trim();
      return text &&
        text.length > 5 &&
        text.length < 2000 &&
        !text.includes('Gemini') &&
        !text.includes('Google') &&
        el.querySelector('span, p, div') &&
        !el.querySelector('svg, img');
    });
  }
  // Filter out controls
  return messages.filter(msg => {
    const text = msg.textContent.trim();
    return text.length > 3 &&
      !/^(Copy|Share|Edit|Delete|Regenerate)$/i.test(text) &&
      !/^\d+$/.test(text) &&
      !text.includes('undefined');
  });
}

/**
 * Extract readable text from a Gemini user prompt element.
 * @param {Element} messageElement
 * @returns {string}
 */
export function extractMessageText(messageElement) {
  const textElement =
    messageElement.querySelector('span') ||
    messageElement.querySelector('p') ||
    messageElement.querySelector('div[class*="formatted"]') ||
    messageElement;
  return textElement ? textElement.textContent.trim() : '';
}
