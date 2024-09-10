const nameInput = document.getElementById("save-name");
const saveTabsBtn = document.getElementById("save-tabs-btn");
const showTabsBtn = document.getElementById("show-tabs-btn");
const tabsList = document.getElementById("open-tab-set-list");
let tabsListIsVisible = false;

const renderTabList = () => {
  tabsList.innerHTML = "";

  chrome.runtime.sendMessage({ action: "getTabs" }).then((res) => {
    console.log(res);
    Object.keys(res).forEach((key) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <span>${key}</span>
        <button class="delete-tab-btn">
          <img src="./img/delete-icon.svg" alt="delete-btn" />
        </button>
      `;
      tabsList.appendChild(li);

      li.querySelector(".delete-tab-btn").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "deleteTab", name: key }, () => {
          renderTabList();
        });
      });
    });
  });
};

saveTabsBtn.addEventListener("click", () => {
  const name = nameInput.value;
  if (name) {
    chrome.runtime.sendMessage({ action: "saveTabs", name: name }, () => {
      if (tabsListIsVisible) {
        renderTabList();
      }
    });
    nameInput.value = "";
  }
});

showTabsBtn.addEventListener("click", () => {
  tabsListIsVisible = !tabsListIsVisible;
  if (tabsListIsVisible) {
    showTabsBtn.innerHTML = "Hide Tab Sets";
    tabsList.style.display = "block";
    renderTabList();
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
