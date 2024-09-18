const saveTabs = (name) => {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const urls = tabs.map((tab) => tab.url);
    chrome.storage.sync.set({ [name]: urls }, function () {
      console.log("Tabs saved under the name:", name);
    });
  });
};

const openTabs = (name) => {
  chrome.storage.sync.get([name], (result) => {
    const urls = result[name];
    if (urls) {
      chrome.windows.create({ url: urls, state: "maximized" });
    }
  });
};

const getTabs = (callback) => {
  chrome.storage.sync.get(null, (items) => {
    callback(items);
  });
};

const deleteTab = (key) => {
  chrome.storage.sync.remove(key);
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
  } else if (request.action === "deleteTab") {
    deleteTab(request.name);
  }
  sendResponse({ status: "done" });
});
