const colorInput = document.getElementById('highlightColor');
const colorValue = document.getElementById('colorValue');
const hideNonSS = document.getElementById('hideNonSS');

// Load saved settings
chrome.storage.sync.get(['highlightColor', 'hideNonSS'], (result) => {
  if (result.highlightColor) {
    colorInput.value = result.highlightColor;
    colorValue.textContent = result.highlightColor;
  }
  if (typeof result.hideNonSS === "boolean") {
    hideNonSS.checked = result.hideNonSS;
  }
});

// Save color on change
colorInput.addEventListener('input', () => {
  const color = colorInput.value;
  colorValue.textContent = color;
  chrome.storage.sync.set({ highlightColor: color });
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