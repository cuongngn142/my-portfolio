import { URL_LOCAL, URL_PROD } from "./config.js";
import { CLOUD_NAME, UPLOAD_PRESET } from "./config.js";
const url = URL_PROD;

let listContainer;
let saveBtn;
let btnNew;
let modalEl;
let modal;
let initialized = false;

async function loadProjects() {
  listContainer.innerHTML = "";

  const res = await fetch(`${url}/api/projects`);
  const data = await res.json();

  data.forEach((p) => {
    const item = document.createElement("div");
    item.className =
      "d-flex justify-content-between align-items-center border p-2 mb-2 rounded";

    item.innerHTML = `
      <div>
        <div class="fw-bold">${p.name}</div>
        <div class="text-muted small">${p.description}</div>
      </div>

      <div>
        <button class="btn btn-sm btn-warning me-2 btn-edit" data-id="${p._id}">Edit</button>
        <button class="btn btn-sm btn-danger btn-delete" data-id="${p._id}">Delete</button>
      </div>
    `;

    listContainer.appendChild(item);
  });

  bindEditButtons();
  bindDeleteButtons();
}

async function initProjectsPage() {
  if (!initialized) {
    listContainer = document.querySelector(".card-project-list");
    saveBtn = document.getElementById("saveProjectBtn");
    btnNew = document.getElementById("btnNewProject");
    modalEl = document.getElementById("projectModal");

    if (!listContainer || !saveBtn || !btnNew || !modalEl) {
      console.error("Project page elements not found!");
      return;
    }

    modal = new bootstrap.Modal(modalEl);

    btnNew.addEventListener("click", () => {
      document.getElementById("projectForm").reset();
      document.getElementById("project-id").value = "";
      document.getElementById("modalTitle").textContent = "New Project";
    });

    saveBtn.addEventListener("click", async () => {
      const id = document.getElementById("project-id").value;

      const data = {
        name: document.getElementById("project-name").value,
        description: document.getElementById("project-desc").value,
        urlImage: document.getElementById("project-img").value,
        projectTimeline: document.getElementById("project-timeline").value,
        role: document.getElementById("project-role").value,
        technology: document.getElementById("project-tech").value,
        mainFeatures: document
          .getElementById("project-features")
          .value.split(",")
          .map((s) => s.trim()),
        urlDemo: document.getElementById("project-demo").value,
        urlSource: document.getElementById("project-source").value,
        urlVideoDemo: document.getElementById("project-video").value,
      };

      const method = id ? "PUT" : "POST";
      const api = id ? `${url}/api/projects/${id}` : `${url}/api/projects`;

      await fetch(api, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      modal.hide();
      await loadProjects();
    });

    const projectFile = document.getElementById("project-file");
    if (projectFile) {
      projectFile.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imgInput = document.getElementById("project-img");
        imgInput.value = "Uploading...";

        try {
          const url = await uploadToCloudinary(file);
          imgInput.value = url;
        } catch (err) {
          imgInput.value = "";
          alert("Upload failed!");
        }
      });
    }

    initialized = true;
  }

  await loadProjects();
}

function bindEditButtons() {
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const res = await fetch(`${url}/api/projects/${id}`);
      const p = await res.json();

      document.getElementById("project-id").value = p._id;
      document.getElementById("project-name").value = p.name;
      document.getElementById("project-timeline").value = p.projectTimeline;
      document.getElementById("project-desc").value = p.description;
      document.getElementById("project-img").value = p.urlImage;
      document.getElementById("project-role").value = p.role;
      document.getElementById("project-tech").value = p.technology;
      document.getElementById("project-features").value =
        p.mainFeatures?.join(", ") || "";
      document.getElementById("project-demo").value = p.urlDemo;
      document.getElementById("project-source").value = p.urlSource;
      document.getElementById("project-video").value = p.urlVideoDemo;

      document.getElementById("modalTitle").textContent = "Edit Project";

      modal.show();
    });
  });
}

function bindDeleteButtons() {
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("dblclick", async () => {
      const id = btn.dataset.id;

      await fetch(`${url}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      loadProjects();
    });
  });
}

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
}

export { initProjectsPage };
