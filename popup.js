const nameInput = document.getElementById("save-name");
const saveTabsBtn = document.getElementById("save-tabs-btn");
const showTabsBtn = document.getElementById("show-tabs-btn");
const confirmOverwriteBtn = document.getElementById("confirm-overwrite");
const declineOverwriteBtn = document.getElementById("decline-overwrite");
const popupConfirm = document.getElementById("popup-confirm");
const tabsList = document.getElementById("open-tab-set-list");
let tabsListIsVisible = false;
let tabSetNameToOverwirte = "";

const isTabSetAlreadyExist = (name, callback) => {
  chrome.storage.local.get([name], (result) => {
    if (result[name]) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

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
      li.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "openTabs", name: key }, () => {
          console.log("worked");
        });
      });
    });
  });
};

saveTabsBtn.addEventListener("click", () => {
  const name = nameInput.value;

  if (name) {
    isTabSetAlreadyExist(name, (exists) => {
      if (exists) {
        tabSetNameToOverwirte = name;
        popupConfirm.style.display = "flex";

        confirmOverwriteBtn.addEventListener("click", () => {
          chrome.runtime.sendMessage({ action: "saveTabs", name: name }, () => {
            if (tabsListIsVisible) {
              renderTabList();
            }
            popupConfirm.style.display = "none";
          });
        });

        declineOverwriteBtn.addEventListener("click", () => {
          popupConfirm.style.display = "none";
        });
      } else {
        chrome.runtime.sendMessage({ action: "saveTabs", name: name }, () => {
          if (tabsListIsVisible) {
            renderTabList();
          }
        });
        nameInput.value = "";
      }
    });
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
});
