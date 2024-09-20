const nameInput = document.getElementById("save-name");
const saveTabsBtn = document.getElementById("save-tabs-btn");
const showTabsBtn = document.getElementById("show-tabs-btn");
const tabsList = document.getElementById("open-tab-set-list");
let tabsListIsVisible = false;
let tabSetNameToOverwirte = "";

const isTabSetAlreadyExist = (name, callback) => {
  chrome.storage.sync.get([name], (result) => {
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
        const div = document.createElement("div");
        div.className = "popup-confirm";
        div.innerHTML = `
      <div class="popup-content">
        <p>
          A tab set with this name already exist. Do you want to overwrite tabs?
        </p>
        <button class="popup-btn" id="confirm-overwrite">Yes</button>
        <button class="popup-btn" id="decline-overwrite">No</button>
      </div>`;
        document.body.appendChild(div);

        const confirmOverwriteBtn =
          document.getElementById("confirm-overwrite");
        const declineOverwriteBtn =
          document.getElementById("decline-overwrite");

        confirmOverwriteBtn.addEventListener("click", () => {
          chrome.runtime.sendMessage({ action: "saveTabs", name: name }, () => {
            if (tabsListIsVisible) {
              renderTabList();
            }
            nameInput.value = "";
            document.body.removeChild(div);
          });
        });

        declineOverwriteBtn.addEventListener("click", () => {
          document.body.removeChild(div);
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

setInterval(() => {
  chrome.storage.sync.getBytesInUse(null, (bytesInUse) => {
    console.log(`Storage used: ${bytesInUse} bytes out of 102,400 bytes`);
  });
  chrome.storage.sync.get(null, (items) => {
    console.log(items);
  });
}, 60000);
