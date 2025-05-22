chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "setBadge") {
    chrome.storage.sync.get(['extensionEnabled'], (result) => {
      if (result.extensionEnabled === false) {
        chrome.action.setBadgeText({ text: "X", tabId: sender.tab.id });
        chrome.action.setBadgeBackgroundColor({ color: "#e53935", tabId: sender.tab.id });
        chrome.action.setIcon({ path: { "48": "icon48_grey.png" }, tabId: sender.tab.id });
      } else {
        chrome.action.setBadgeText({ text: msg.count > 0 ? String(msg.count) : "", tabId: sender.tab.id });
        chrome.action.setBadgeBackgroundColor({ color: "#32cd32", tabId: sender.tab.id });
        chrome.action.setIcon({ path: { "48": "icon48.png" }, tabId: sender.tab.id });
      }
    });
  }
  if (msg.type === "clearBadge") {
    chrome.action.setBadgeText({ text: "", tabId: sender.tab.id });
  }
  if (msg.type === "toggleEnabled") {
    chrome.storage.sync.set({ extensionEnabled: msg.enabled });
    sendResponse({ status: "ok" });
  }
});