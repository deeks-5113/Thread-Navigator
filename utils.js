// utils.js
export function getCurrentPlatform() {
  const url = window.location.href;
  if (url.includes('chatgpt.com') || url.includes('chat.openai.com')) return 'chatgpt';
  if (url.includes('perplexity.ai')) return 'perplexity';
  if (url.includes('gemini.google.com')) return 'gemini';
  return null;
}
