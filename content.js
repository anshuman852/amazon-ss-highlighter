// content.js
const KEYWORDS = ["subscribe & save", "auto-delivery"];
const HIGHLIGHT_CLASS = "amazon-ss-highlight";
const NONSS_DIM_CLASS = "amazon-ss-dim";
const SPONSORED_DIM_CLASS = "amazon-ss-sponsored-dim";
const SPONSORED_WATERMARK_CLASS = "amazon-ss-sponsored-watermark";

// Get highlight color, nonSSMode, and sponsoredMode from storage, fallback to default
function getSettings(callback) {
  chrome.storage.sync.get(['highlightColor', 'nonSSMode', 'sponsoredMode', 'extensionEnabled'], (result) => {
    callback({
      color: result.highlightColor || "#32cd32",
      nonSSMode: result.nonSSMode || "dim",
      sponsoredMode: result.sponsoredMode || "dim",
      enabled: result.extensionEnabled !== false
    });
  });
}

// Utility: Check if a node contains any keyword (case-insensitive)
function containsSubscribeSave(node) {
  if (!node) return false;
  const text = node.textContent.toLowerCase();
  return KEYWORDS.some(keyword => text.includes(keyword));
}

// Utility: Check if a tile is sponsored
function isSponsored(tile) {
  return !!tile.querySelector('span, div') && (
    Array.from(tile.querySelectorAll('span, div')).some(el =>
      el.textContent.trim().toLowerCase() === "sponsored"
    )
  );
}

// Add sponsored watermark if needed
function addSponsoredWatermark(tile) {
  if (!tile.querySelector('.' + SPONSORED_WATERMARK_CLASS)) {
    const mark = document.createElement('div');
    mark.className = SPONSORED_WATERMARK_CLASS;
    mark.textContent = "Sponsored";
    mark.style.cssText = "position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.85);color:#e91e63;font-weight:bold;font-size:12px;padding:2px 8px;border-radius:6px;z-index:10;pointer-events:none;box-shadow:0 1px 4px #0002;";
    tile.style.position = "relative";
    tile.appendChild(mark);
  }
}
function removeSponsoredWatermark(tile) {
  const mark = tile.querySelector('.' + SPONSORED_WATERMARK_CLASS);
  if (mark) mark.remove();
}

// Highlight, dim, or hide a product tile based on settings
function processTile(tile, color, nonSSMode, isSSPresent, sponsoredMode, enabled) {
  if (!enabled) {
    tile.classList.remove(HIGHLIGHT_CLASS, NONSS_DIM_CLASS, SPONSORED_DIM_CLASS);
    removeSponsoredWatermark(tile);
    tile.style.border = "";
    tile.style.boxShadow = "";
    tile.style.display = "";
    tile.style.pointerEvents = "";
    return;
  }

  const isSpon = isSponsored(tile);

  // Sponsored logic
  if (isSpon) {
    if (sponsoredMode === "hide") {
      tile.classList.remove(SPONSORED_DIM_CLASS);
      removeSponsoredWatermark(tile);
      tile.style.display = "none";
      return;
    } else if (sponsoredMode === "dim") {
      tile.classList.add(SPONSORED_DIM_CLASS);
      addSponsoredWatermark(tile);
      tile.style.display = "";
    } else {
      tile.classList.remove(SPONSORED_DIM_CLASS);
      removeSponsoredWatermark(tile);
      tile.style.display = "";
    }
  } else {
    tile.classList.remove(SPONSORED_DIM_CLASS);
    removeSponsoredWatermark(tile);
    tile.style.display = "";
  }

  // S&S logic
  const isSS = containsSubscribeSave(tile);
  if (isSS) {
    if (!tile.classList.contains(HIGHLIGHT_CLASS)) {
      tile.classList.add(HIGHLIGHT_CLASS);
    }
    tile.classList.remove(NONSS_DIM_CLASS);
    tile.style.setProperty('border', `2px solid ${color}`, 'important');
    tile.style.setProperty('box-shadow', `0 0 10px 2px ${color}55`, 'important');
    tile.style.pointerEvents = "";
  } else {
    tile.classList.remove(HIGHLIGHT_CLASS);
    tile.style.border = "";
    tile.style.boxShadow = "";
    if (!isSSPresent) {
      tile.classList.remove(NONSS_DIM_CLASS);
      tile.style.pointerEvents = "";
    } else if (nonSSMode === "hide") {
      tile.classList.remove(NONSS_DIM_CLASS);
      tile.style.display = "none";
      tile.style.pointerEvents = "";
    } else if (nonSSMode === "dim") {
      tile.classList.add(NONSS_DIM_CLASS);
      tile.style.display = "";
      tile.style.pointerEvents = "";
    } else {
      tile.classList.remove(NONSS_DIM_CLASS);
      tile.style.display = "";
      tile.style.pointerEvents = "";
    }
  }
}

// Highlight the returns policy card based on its type
function highlightReturnsPolicyCard(color) {
  const badKeywords = ["non-returnable", "final sale"];
  const goodKeywords = ["return & exchange", "return and exchange", "returnable"];
  
  // Try different selectors for the returns policy
  const selectors = [
    '[data-name="RETURNS_POLICY"].icon-container',
    '#RETURNS_POLICY',
    '.a-link-normal:contains("Non-Returnable")',
    '.a-link-normal:contains("Return")'
  ];
  
  for (const selector of selectors) {
    try {
      const elements = document.querySelectorAll(selector);
      
      if (elements.length > 0) {
        for (const el of elements) {
          const text = el.innerText.toLowerCase();
          
          // Highlight non-returnable/final sale in red
          if (badKeywords.some(k => text.includes(k))) {
            el.style.setProperty('border', '3px solid #e53935', 'important');
            el.style.setProperty('border-radius', '12px', 'important');
            el.style.setProperty('background', '#fff0f0', 'important');
            el.style.setProperty('box-shadow', '0 0 8px 2px #e5393555', 'important');
          }
          // Highlight return & exchange in green
          else if (goodKeywords.some(k => text.includes(k))) {
            el.style.setProperty('border', '3px solid #32cd32', 'important');
            el.style.setProperty('border-radius', '12px', 'important');
            el.style.setProperty('background', '#f0fff0', 'important');
            el.style.setProperty('box-shadow', `0 0 8px 2px ${color}55`, 'important');
          }
        }
      }
    } catch (e) {
      // Silently continue to next selector
    }
  }
}

// Scan and process all products, send badge count
function scanAndProcess(settings) {
  const tiles = document.querySelectorAll('[data-asin][data-component-type="s-search-result"]');
  let ssCount = 0;
  tiles.forEach(tile => {
    if (containsSubscribeSave(tile)) ssCount++;
  });
  const isSSPresent = ssCount > 0;
  tiles.forEach(tile => processTile(tile, settings.color, settings.nonSSMode, isSSPresent, settings.sponsoredMode, settings.enabled));
  chrome.runtime.sendMessage({ type: "setBadge", count: ssCount });

  // Highlight returns policy card on product page
  if (location.pathname.includes('/dp/') || location.pathname.includes('/gp/')) {
    highlightReturnsPolicyCard(settings.color);
  }
}

// Observe for dynamically loaded products (infinite scroll)
const observer = new MutationObserver(() => {
  getSettings(scanAndProcess);
});

// Listen for popup mode changes and quick toggle
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "setNonSSMode" || msg.type === "setSponsoredMode") {
    getSettings(scanAndProcess);
  }
  if (msg.type === "toggleEnabled") {
    chrome.storage.sync.set({ extensionEnabled: msg.enabled }, () => {
      getSettings(scanAndProcess);
    });
  }
});

// Start observing the main search results container
function observeResults() {
  const results = document.querySelector("#search") || document.body;
  if (results) {
    observer.observe(results, { childList: true, subtree: true });
  }
}

// Initial run
getSettings(scanAndProcess);
observeResults();

// Run again after a delay to catch dynamically loaded elements
setTimeout(() => {
  getSettings(scanAndProcess);
}, 1500);