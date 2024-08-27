/**
 * Hàm lấy dữ liệu từ tệp JSON và tạo các tab điều hướng cùng nội dung động.
 */
async function fetchData() {
  try {
    // Lấy dữ liệu từ tệp JSON
    const response = await fetch("./../../data/Data.json");

    // Kiểm tra lỗi mạng
    if (!response.ok) {
      throw new Error("Lỗi mạng: " + response.statusText);
    }

    // Phân tích dữ liệu JSON
    const data = await response.json();

    // Lấy các tham chiếu đến các khu vực tab điều hướng và nội dung
    const navTabs = document.getElementById("nav-tabs");
    const tabContent = document.getElementById("tab-content");

    // Hàm tạo một tab điều hướng
    function createNavTab(pill, isActive) {
      const navItem = document.createElement("li");
      navItem.classList.add("nav-item");
      navItem.innerHTML = `
                <a class="nav-link ${isActive}" 
                    id="${pill.tabName}-tab" 
                    data-toggle="tab" 
                    href="#${pill.tabName}" role="tab" 
                    aria-controls="${pill.tabName}" 
                    aria-selected="${isActive === "active"}">
                    ${pill.showName}
                </a>
            `;
      return navItem;
    }

    // Hàm tạo một tab pane
    function createTabPane(pill, items) {
      const tabPane = document.createElement("div");
      tabPane.classList.add("tab-pane", "fade");
      if (pill.isActive) {
        tabPane.classList.add("active");
      }
      tabPane.id = pill.tabName;
      tabPane.setAttribute("role", "tabpanel");
      tabPane.setAttribute("aria-labelledby", `${pill.tabName}-tab`);

      items.forEach((item) => {
        const itemContent = document.createElement("div");
        itemContent.classList.add("d-inline-block", "p-4", "m-2");
        itemContent.style.width = "225px";
        itemContent.innerHTML = `
                    <img src="${item.imgSrc_jpg}" alt="${item.name}" style="width: 100%;">
                    <h5 class='text-center my-3'>${item.name}</h5>
                    <button style='width: 100%' class='tryOn-btn' 
                        data-type="${pill.type}" data-img-src="${item.imgSrc_png}">
                        Thử đồ
                    </button>
                `;
        tabPane.appendChild(itemContent);
      });

      return tabPane;
    }

    // Xử lý các tab điều hướng và tạo các tab và nội dung
    data.navPills.forEach((pill, index) => {
      const isActive = index === 0 ? "active" : "";
      const navTab = createNavTab(pill, isActive);
      navTabs.appendChild(navTab);

      // Lọc các mục theo loại và tạo tab pane
      const items = data.tabPanes.filter((item) => item.type === pill.type);
      const tabPane = createTabPane(pill, items);
      tabContent.appendChild(tabPane);
    });

    // Thêm các sự kiện cho các nút 'Thử đồ'
    document.querySelectorAll(".tryOn-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const type = this.getAttribute("data-type");
        const imgSrc = this.getAttribute("data-img-src");
        const modelPart = document.querySelector(`.${type}`);

        if (modelPart) {
          modelPart.style.backgroundImage = `url("${imgSrc}")`;
        }
      });
    });
  } catch (error) {
    console.error("Có lỗi khi đọc dữ liệu: ", error);
  }
}

// Gọi hàm fetchData để khởi tạo trang
fetchData();
