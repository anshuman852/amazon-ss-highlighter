const colorValue = document.getElementById('colorValue');
const hideNonSS = document.getElementById('hideNonSS');
const colorOptions = document.getElementById('colorOptions');
const swatches = colorOptions.querySelectorAll('.color-swatch');

// Basic color palette
const COLORS = [
  "#32cd32", // Green
  "#ff9800", // Orange
  "#2196f3", // Blue
  "#e91e63", // Pink
  "#ffd600", // Yellow
  "#222"     // Black
];

// Load saved settings
chrome.storage.sync.get(['highlightColor', 'hideNonSS'], (result) => {
  let color = result.highlightColor || "#32cd32";
  colorValue.textContent = color;
  swatches.forEach(swatch => {
    if (swatch.dataset.color === color) {
      swatch.classList.add('selected');
    } else {
      swatch.classList.remove('selected');
    }
  });
  if (typeof result.hideNonSS === "boolean") {
    hideNonSS.checked = result.hideNonSS;
  }
});

// Color swatch click handler
swatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    const color = swatch.dataset.color;
    chrome.storage.sync.set({ highlightColor: color });
    colorValue.textContent = color;
    swatches.forEach(s => s.classList.remove('selected'));
    swatch.classList.add('selected');
  });
});

// Save toggle on change and notify content script
hideNonSS.addEventListener('change', () => {
  const value = hideNonSS.checked;
  chrome.storage.sync.set({ hideNonSS: value }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "toggleHideNonSS", hide: value });
      }
    });
  });
});