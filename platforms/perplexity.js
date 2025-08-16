// platforms/perplexity.js

/**
 * Find all user prompt elements in Perplexity conversations.
 * @returns {Element[]}
 */
export function findUserMessages() {
  const selectors = [
    '[class*="UserMessage"]',
    '[class*="user-message"]',
    'div[class*="prose"]:has(div[class*="user"])',
    'div:has(> div[class*="border"]) div[class*="prose"]',
    'div[class*="mt-4"]:has(div[class*="prose"])',
    'div[data-testid*="user"]'
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
    // Fallback: look for prose/markdown user queries with filters
    const allDivs = document.querySelectorAll('div[class*="prose"], div[class*="markdown"]');
    messages = Array.from(allDivs).filter(el => {
      const text = el.textContent.trim();
      const parent = el.closest('div[class*="border"], div[class*="rounded"]');
      return text &&
        text.length > 5 &&
        text.length < 2000 &&
        parent &&
        !text.includes('Sources') &&
        !text.includes('Related') &&
        !text.startsWith('Answer:') &&
        !text.startsWith('Response:');
    });
  }
  // Filter out control/non-content
  return messages.filter(msg => {
    const text = msg.textContent.trim();
    return text.length > 3 &&
      !/^(Copy|Share|Edit|Delete|Regenerate)$/i.test(text) &&
      !/^\d+$/.test(text) &&
      !text.includes('undefined');
  });
}

/**
 * Extract readable text from a Perplexity user prompt element.
 * @param {Element} messageElement
 * @returns {string}
 */
export function extractMessageText(messageElement) {
  const textElement =
    messageElement.querySelector('[class*="prose"] p') ||
    messageElement.querySelector('p') ||
    messageElement.querySelector('div[class*="markdown"]') ||
    messageElement;
  return textElement ? textElement.textContent.trim() : '';
}
