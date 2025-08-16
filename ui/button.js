// ui/button.js
export function createFloatingButton(platform, onClick) {
  const colors = {
    chatgpt: 'linear-gradient(135deg, #10a37f, #0d8b6b)',
    perplexity: 'linear-gradient(135deg, #20a4f3, #1976d2)',
    gemini: 'linear-gradient(135deg, #4285f4, #1565c0)'
  };
  const button = document.createElement('div');
  button.id = 'thread-navigator-btn';
  button.innerHTML = '📋';
  button.title = `Show ${platform} thread prompts`;
  button.style.cssText = `
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
    user-select: none !important;
    border: none !important;
  `;
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  });
  button.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });
  button.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
  document.body.appendChild(button);
}
