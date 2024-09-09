const saveTabs = (name) => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const urls = tabs.map((tab) => tab.url);
    chrome.storage.local.set({ [name]: urls });
  });
};

const openTabs = () => {
  chrome.storage.local.get((result) => {});
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveTabs") {
    saveTabs(request.name);
  } else if (request.action === "openTabs") {
    openTabs();
  }
});
