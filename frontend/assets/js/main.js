import { URL_PROD, URL_LOCAL } from "./config.js";

const url = URL_PROD;

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 110) {
    navbar.classList.add("navbar-scroll");
    navbar.classList.remove("navbar-white");
  } else {
    navbar.classList.remove("navbar-scroll");
    navbar.classList.add("navbar-white");
  }
});

function renderListProject(data) {
  const container = document.querySelector(".project-list");
  if (!container) return;
  container.innerHTML = "";

  data.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-4 d-flex";

    col.innerHTML = `
        <div class="card h-100 flex-fill card-hover">
          <img
            src="${p.urlImage || "./assets/images/img-project-default.jpg"}"
            class="card-img-top img-project"
            alt="${p.name}"
            loading="lazy"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text text-truncate-multi card-desc">
              ${p.description || "No description available."}
            </p>
            <button 
              href="./pages/detail-project.html"
              class="btn btn-warning mt-auto text-light fw-bold view-btn"
              data-id=${p._id}
            >
              View More
            </button>
          </div>
        </div>
      `;

    container.appendChild(col);
  });
  const viewBtns = container.querySelectorAll(".view-btn");
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = e.currentTarget.dataset.id;
      window.location.href = `./pages/detail-project.html?id=${projectId}`;
    });
  });
}

function wait(ms) {
  //setTimeout(callback, delay, arg1, arg2, ...) đưa resolve do promise tạo làm callback để thông báo cho await biết trạng thái hiện tại của promise

  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getProjects() {
  const status = document.querySelector(".project-status");
  status.textContent = "Đang tải dữ liệu...";
  await wait(3000);
  try {
    const res = await fetch(`${url}/api/projects`);
    const data = await res.json();
    if (data.length === 0) {
      status.textContent = "Không có dữ liệu.";
      return;
    }
    status.textContent = "";

    renderListProject(data);
  } catch (err) {
    status.textContent = "Lỗi khi tải dữ liệu.";
    console.error(err);
  }
}

getProjects();

function isValidGmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return regex.test(email);
}

const form = document.getElementById("contact-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const emailContent = form.email.value;
  const content = document.getElementById("label-content");

  if (!isValidGmail(emailContent)) {
    if (!content) return;
    content.textContent = "Please enter a valid email address.";
    return;
  }
  const messageContent = form.message.value;

  const data = {
    email: emailContent,
    message: messageContent,
    status: "new",
  };

  fetch(`${url}/api/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      res.json();
      if (res.ok) {
        window.location.href = "./pages/completed.html";
      } else {
        console.error("Lỗi khi gửi dữ liệu");
      }
    })
    .then((result) => {
      form.reset();
      content.textContent = "";
    })
    .catch((err) => console.error(err));
});
