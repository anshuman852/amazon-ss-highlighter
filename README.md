# Amazon Subscribe & Save Highlighter

A Chrome extension that visually highlights and optionally filters products eligible for "Subscribe & Save" or "auto-delivery" on Amazon India search result pages.

[![Download as ZIP](https://img.shields.io/badge/Download%20ZIP-Click%20here-brightgreen?logo=github)](https://github.com/anshuman852/amazon-ss-highlighter/archive/refs/heads/main.zip)

## Features

- Highlights eligible products with a customizable color.
- Option to hide non-eligible products.
- Works with infinite scroll and dynamically loaded results.
- No configuration required—runs automatically.
- Simple popup UI for settings.

## Installation

1. Clone or download this repository.
2. Go to `chrome://extensions/` in Chrome.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the extension folder.

## Usage

- Visit any [Amazon India search page](https://www.amazon.in/s).
- Eligible products will be highlighted.
- Click the extension icon to change highlight color or hide non-eligible products.

## Development

- Built with Manifest V3, HTML, CSS, and JavaScript.
- Uses MutationObserver for dynamic content.
- Settings are stored using Chrome's storage API.

## License

MIT