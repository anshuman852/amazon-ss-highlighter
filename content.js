// content.js
const KEYWORDS = ["subscribe & save", "auto-delivery"];
const HIGHLIGHT_CLASS = "amazon-ss-highlight";

// Get highlight color and hide toggle from storage, fallback to default
function getSettings(callback) {
  chrome.storage.sync.get(['highlightColor', 'hideNonSS'], (result) => {
    callback({
      color: result.highlightColor || "#32cd32",
      hide: !!result.hideNonSS
    });
  });
}

// Utility: Check if a node contains any keyword (case-insensitive)
function containsSubscribeSave(node) {
  if (!node) return false;
  const text = node.textContent.toLowerCase();
  return KEYWORDS.some(keyword => text.includes(keyword));
}

// Highlight or hide a product tile based on settings
function processTile(tile, color, hide) {
  const isSS = containsSubscribeSave(tile);
  if (isSS) {
    if (!tile.classList.contains(HIGHLIGHT_CLASS)) {
      tile.classList.add(HIGHLIGHT_CLASS);
    }
    tile.style.setProperty('border', `2px solid ${color}`, 'important');
    tile.style.setProperty('box-shadow', `0 0 10px 2px ${color}55`, 'important');
    tile.style.display = "";
  } else {
    tile.classList.remove(HIGHLIGHT_CLASS);
    tile.style.border = "";
    tile.style.boxShadow = "";
    tile.style.display = hide ? "none" : "";
  }
}

// Scan and process all products
function scanAndProcess(settings) {
  const tiles = document.querySelectorAll('[data-asin][data-component-type="s-search-result"]');
  tiles.forEach(tile => processTile(tile, settings.color, settings.hide));
}

// Observe for dynamically loaded products (infinite scroll)
const observer = new MutationObserver(() => {
  getSettings(scanAndProcess);
});

// Listen for popup toggle changes
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "toggleHideNonSS") {
    getSettings(scanAndProcess);
  }
});

// Start observing the main search results container
function observeResults() {
  const results = document.querySelector("#search");
  if (results) {
    observer.observe(results, { childList: true, subtree: true });
  }
}

// Initial run
getSettings(scanAndProcess);
observeResults();