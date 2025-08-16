import { getCurrentPlatform } from './utils.js';
import { createFloatingButton } from './ui/button.js';
import { initPlatform } from './platforms/platformInit.js';

let retryCount = 0;
const maxRetries = 10;

function initExtension() {
  const platform = getCurrentPlatform();
  if (!platform) return;

  if (document.getElementById('thread-navigator-btn')) return;

  createFloatingButton(platform, () => {
    initPlatform(platform);
  });
}

function tryInit() {
  retryCount++;
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initExtension();
  } else if (retryCount < maxRetries) {
    setTimeout(tryInit, 1000);
  }
}

// Start
tryInit();
