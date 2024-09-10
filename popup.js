const nameInput = document.getElementById("save-name");
const saveTabsBtn = document.getElementById("save-tabs-btn");
const openTabsBtn = document.getElementById("open-tabs-btn");
const tabsList = document.getElementById("open-tab-set-list");
const tabsListIsVisible = false;
saveTabsBtn.addEventListener("click", () => {
  const name = nameInput.value;
  if (name) {
    chrome.runtime.sendMessage(
      { action: "saveTabs", name: name },
      function (response) {
        console.log("Tabs saved:", response);
      }
    );
  }
});

openTabsBtn.addEventListener("click", () => {
  tabsListIsVisible = !tabsListIsVisible;
  if (tabsListIsVisible) {
    openTabsBtn.innerHTML = "Hide Tab Sets";
    tabsList.style.display = "block";
  } else {
    openTabsBtn.innerHTML = "Show Tab Sets";
    tabsList.style.display = "none";
  }
  const name = nameInput.value;
  if (name) {
    chrome.runtime.sendMessage(
      { action: "openTabs", name: name },
      function (response) {
        console.log("Tabs saved:", response);
      }
    );
  }
});
