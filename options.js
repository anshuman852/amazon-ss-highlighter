const colorValue = document.getElementById('colorValue');
const colorOptions = document.getElementById('colorOptions');
const swatches = colorOptions.querySelectorAll('.color-swatch');
const nonSSMode = document.getElementById('nonSSMode');
const sponsoredMode = document.getElementById('sponsoredMode');

// Load saved settings, default to "dim"
chrome.storage.sync.get(['highlightColor', 'nonSSMode', 'sponsoredMode'], (result) => {
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

// Save nonSSMode on change
nonSSMode.addEventListener('change', () => {
  const value = nonSSMode.value;
  chrome.storage.sync.set({ nonSSMode: value });
});

// Save sponsoredMode on change
sponsoredMode.addEventListener('change', () => {
  const value = sponsoredMode.value;
  chrome.storage.sync.set({ sponsoredMode: value });
});