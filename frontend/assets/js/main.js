const url = "https://my-portfolio-1oua.onrender.com";

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
      console.log("Project clicked:", projectId);
      window.location.href = `./pages/detail-project.html?id=${projectId}`;
    });
  });
}

async function getProjects() {
  try {
    const res = await fetch(`${url}/api/projects`);
    const data = await res.json();
    renderListProject(data);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

getProjects();
