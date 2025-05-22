# Amazon Subscribe & Save Highlighter

A Chrome extension that visually highlights and optionally filters products eligible for "Subscribe & Save" or "auto-delivery" on Amazon India search result pages.

[![Download as ZIP](https://img.shields.io/badge/Download%20ZIP-Click%20here-brightgreen?logo=github)](https://github.com/your-username/amazon-ss-highlighter/archive/refs/heads/main.zip)

## Features

- Highlights eligible products with a customizable color.
- Option to hide, dim (grey overlay), or show non-eligible products (default: Dim).
- Sponsored items can be hidden, dimmed (with a "Sponsored" watermark), or shown normally (default: Dim).
- If no Subscribe & Save products are found, all products are shown normally and a message is displayed near the results bar.
- Works with infinite scroll and dynamically loaded results.
- No configuration required—runs automatically.
- Simple popup UI and options page for settings.

## How to Load the Extension from ZIP

1. **Extract** the ZIP file to a folder on your computer.
2. Open Chrome and go to [`chrome://extensions/`](chrome://extensions/).
3. Enable **Developer mode** (toggle at the top right).
4. Click **Load unpacked**.
5. Select the folder where you extracted the ZIP.

The extension icon will appear in your Chrome toolbar.

## Usage

- Visit any [Amazon India search page](https://www.amazon.in/s).
- Eligible products will be highlighted.
- Click the extension icon or open the options page to change highlight color, hide/dim non-eligible products, or control how sponsored items appear.

## Development

- Built with Manifest V3, HTML, CSS, and JavaScript.
- Uses MutationObserver for dynamic content.
- Settings are stored using Chrome's storage API.

## License

MIT