const saveTabs = (name) => {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const urls = tabs.map((tab) => tab.url);
    chrome.storage.local.set({ [name]: urls }, function () {
      console.log("Tabs saved under the name:", name);
    });
  });
};

const openTabs = (name) => {
  chrome.storage.local.get([name], function (result) {
    const urls = result[name];
    if (urls) {
      urls.forEach((url) => chrome.tabs.create({ url }));
    }
  });
};

const getTabs = () => {
  chrome.storage.local.get();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveTabs") {
    saveTabs(request.name);
  } else if (request.action === "openTabs") {
    openTabs(request.name);
  }
  sendResponse({ status: "done" });
});
