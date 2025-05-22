const colorValue = document.getElementById('colorValue');
const colorOptions = document.getElementById('colorOptions');
const swatches = colorOptions.querySelectorAll('.color-swatch');
const nonSSMode = document.getElementById('nonSSMode');
const sponsoredMode = document.getElementById('sponsoredMode');
const quickToggle = document.getElementById('quickToggle');

function setQuickToggleState(enabled) {
  if (enabled) {
    quickToggle.textContent = "Disable Extension";
    quickToggle.classList.remove('off');
  } else {
    quickToggle.textContent = "Enable Extension";
    quickToggle.classList.add('off');
  }
}

// Load saved settings, default to "dim" and enabled
chrome.storage.sync.get(['highlightColor', 'nonSSMode', 'sponsoredMode', 'extensionEnabled'], (result) => {
  let color = result.highlightColor || "#32cd32";
  colorValue.textContent = color;
  swatches.forEach(swatch => {
    if (swatch.dataset.color === color) {
      swatch.classList.add('selected');
    } else {
      swatch.classList.remove('selected');
    }
  });
  nonSSMode.value = result.nonSSMode || "dim";
  sponsoredMode.value = result.sponsoredMode || "dim";
  setQuickToggleState(result.extensionEnabled !== false);
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

// Save nonSSMode on change and notify content script
nonSSMode.addEventListener('change', () => {
  const value = nonSSMode.value;
  chrome.storage.sync.set({ nonSSMode: value }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "setNonSSMode", mode: value });
      }
    });
  });
});

// Save sponsoredMode on change and notify content script
sponsoredMode.addEventListener('change', () => {
  const value = sponsoredMode.value;
  chrome.storage.sync.set({ sponsoredMode: value }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "setSponsoredMode", mode: value });
      }
    });
  });
});

// Quick toggle handler
quickToggle.addEventListener('click', () => {
  chrome.storage.sync.get(['extensionEnabled'], (result) => {
    const enabled = !(result.extensionEnabled === false);
    chrome.storage.sync.set({ extensionEnabled: !enabled }, () => {
      setQuickToggleState(!enabled);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "toggleEnabled", enabled: !enabled });
        }
      });
    });
  });
});