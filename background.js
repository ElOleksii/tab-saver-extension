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
      chrome.winows.create({ url: urls });
      // urls.forEach((url) => chrome.tabs.create({ url }));
    }
  });
};

const getTabs = (callback) => {
  chrome.storage.local.get(null, (items) => {
    callback(items);
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveTabs") {
    saveTabs(request.name);
  } else if (request.action === "openTabs") {
    openTabs(request.name);
  } else if (request.action === "getTabs") {
    getTabs((tabs) => {
      sendResponse(tabs);
    });
    return true;
  }
  sendResponse({ status: "done" });
});
