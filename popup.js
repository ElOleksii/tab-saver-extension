const nameInput = document.getElementById("save-name");
const saveTabsBtn = document.getElementById("save-tabs-btn");
const showTabsBtn = document.getElementById("show-tabs-btn");
const tabsList = document.getElementById("open-tab-set-list");
let tabsListIsVisible = false;

saveTabsBtn.addEventListener("click", () => {
  const name = nameInput.value;
  if (name) {
    chrome.runtime.sendMessage(
      { action: "saveTabs", name: name },
      function (response) {
        console.log("Tabs saved:", response);
      }
    );
    nameInput.value = "";
  }
});

showTabsBtn.addEventListener("click", () => {
  tabsListIsVisible = !tabsListIsVisible;
  if (tabsListIsVisible) {
    showTabsBtn.innerHTML = "Hide Tab Sets";
    tabsList.style.display = "block";
    chrome.runtime.sendMessage({ action: "getTabs" }).then((res) => {
      console.log(res);
      Object.keys(res).forEach((key) => {
        const li = document.createElement("li");
        li.innerText = key;
        tabsList.appendChild(li);
      });
    });
  } else {
    showTabsBtn.innerHTML = "Show Tab Sets";
    tabsList.style.display = "none";
    tabsList.innerHTML = "";
  }

  // const name = nameInput.value;
  // if (name) {
  //   chrome.runtime.sendMessage(
  //     { action: "openTabs", name: name },
  //     function (response) {
  //       console.log("Tabs saved:", response);
  //     }
  //   );
  // }
});
