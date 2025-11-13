import { URL_PROD, URL_LOCAL } from "./config.js";

const url = URL_PROD;
async function loadProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;
  const res = await fetch(`${url}/api/projects/${id}`);
  const p = await res.json();
  document.title = "Chi tiết dự án - " + p.name;
  const container = document.querySelector(".container");
  if (!container) return;

  container.innerHTML = `
      <div class="text-center mb-4">
        <h1 class="fw-bold">${p.name}</h1>
        <p class="text-muted fs-5">${p.description || ""}</p>
      </div>

      <div class="text-center mb-5">
        <img
          src="${p.urlImage || "../assets/images/img-project-default-dark.png"}"
          class="img-fluid rounded shadow-lg"
          style="max-width: 90%; height: auto;"
          alt="Ảnh dự án"
        />
      </div>

      <div class="project-info mb-4">
        <h3 class="fw-semibold mb-3">Thông tin dự án</h3>
        <ul class="list-unstyled">
          <li class="mb-2"><strong>Thời gian thực hiện:</strong> ${
            p.projectTimeline || "-"
          }</li>
          <li class="mb-2"><strong>Vai trò:</strong> ${p.role || "-"}</li>
          <li class="mb-2"><strong>Công nghệ:</strong> ${
            p.technology || "-"
          }</li>
        </ul>
      </div>

      <div class="project-features mb-4">
        <h3 class="fw-semibold mb-3">Chức năng chính</h3>
        <ol class="list-group list-group-numbered border-0">
          ${(p.mainFeatures || [])
            .map(
              (f) =>
                `<li class="list-group-item mb-2 shadow-sm rounded">${f}</li>`
            )
            .join("")}
        </ol>
      </div>

    <h3 class="fw-semibold mb-3">Video Preview</h3>
      ${
        p.urlVideoDemo
          ? `
      <div class="text-center mb-4">
        <video
          id="project-demo-video"
          class="rounded shadow-sm"
          width="100%"
          style="max-width: 480px; height: auto;"
          controls
        >
          <source src="${p.urlVideoDemo}" type="video/mp4">
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </div>
      `
          : ""
      }

      <div class="text-center mt-3">
        <a href="${
          p.urlDemo || "#"
        }" class="btn btn-primary btn-lg me-3 mb-2" target="_blank">View Demo</a>
        <a href="${
          p.urlSource || "#"
        }" class="btn btn-outline-dark btn-lg mb-2" target="_blank">Source Code</a>
        
        <p class="fw-bold fs-6 text-danger">Chú ý: Một số project có backend deploy riêng sẽ cần phải reload trang lại 1-2 lần và đợi để chạy lại server.</p>
      </div>
    `;
}

loadProjectDetail();
