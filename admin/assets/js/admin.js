import { URL_PROD, URL_LOCAL } from "./config.js";

const url = URL_PROD;
const main = document.getElementById("main-content");
const links = document.querySelectorAll("#sidebar-links .nav-link");
const pages = {};
let currentPage = sessionStorage.getItem("currentPage") || "dashboard";

async function initAllPages() {
  const pageNames = ["accounts", "projects", "dashboard", "contacts"];

  for (const page of pageNames) {
    try {
      const res = await fetch(`../pages/${page}.html`);
      if (!res.ok) throw new Error("Page not found");
      const html = await res.text();

      const pageDiv = document.createElement("div");
      pageDiv.id = `page-${page}`;
      pageDiv.style.display = page === currentPage ? "block" : "none";
      pageDiv.innerHTML = html;
      main.appendChild(pageDiv);
      pages[page] = pageDiv;

      if (page === "accounts") {
        const { initAccountsPage } = await import("./account.js");
        await initAccountsPage();
      } else if (page === "projects") {
        const { initProjectsPage } = await import("./project.js");
        await initProjectsPage();
      } else if (page === "dashboard") {
        const { initDashboardPage } = await import("./dashboard.js");
        if (initDashboardPage) await initDashboardPage();
      } else if (page === "contacts") {
        const { initContactsPage } = await import("./contact.js");
        await initContactsPage();
      }
    } catch (err) {
      console.error(`Error loading page ${page}:`, err);
    }
  }
}

function switchPage(page) {
  Object.values(pages).forEach((pageDiv) => {
    pageDiv.style.display = "none";
  });

  if (pages[page]) {
    pages[page].style.display = "block";

    if (page === "accounts") {
      import("./account.js").then(({ initAccountsPage }) => {
        initAccountsPage();
      });
    } else if (page === "projects") {
      import("./project.js").then(({ initProjectsPage }) => {
        initProjectsPage();
      });
    } else if (page === "contacts") {
      import("./contact.js").then(({ initContactsPage }) => {
        initContactsPage();
      });
    }
  }

  currentPage = page;
  sessionStorage.setItem("currentPage", page);
}

links.forEach((link) => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();

    links.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    const page = link.dataset.page;
    switchPage(page);
  });
});

links.forEach((l) => {
  l.classList.toggle("active", l.dataset.page === currentPage);
});

initAllPages();
