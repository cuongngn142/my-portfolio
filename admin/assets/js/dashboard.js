import { URL_LOCAL } from "./config.js";

const url = URL_PROD;

async function loadDashboardStats() {
  try {
    const projectsRes = await fetch(`${url}/api/projects`);
    const projects = await projectsRes.json();
    document.getElementById("total-projects").textContent = projects.length;

    const contactsRes = await fetch(`${url}/api/contacts`);
    const contacts = await contactsRes.json();
    document.getElementById("total-contacts").textContent = contacts.length;

    const newContacts = contacts.filter((c) => c.status === "new").length;
    document.getElementById("new-contacts").textContent = newContacts;

    const adminsRes = await fetch(`${url}/api/admins`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const admins = await adminsRes.json();
    document.getElementById("total-admins").textContent = admins.length;

    loadRecentContacts(contacts.slice(0, 5));
  } catch (err) {
    console.error("Error loading dashboard stats:", err);
  }
}

function loadRecentContacts(contacts) {
  const container = document.getElementById("recent-contacts-list");
  container.innerHTML = "";

  if (contacts.length === 0) {
    container.innerHTML = '<p class="text-muted">Chưa có contact nào</p>';
    return;
  }

  const table = document.createElement("table");
  table.className = "table table-sm table-hover";
  table.innerHTML = `
    <thead class="table-light">
      <tr>
        <th>Email</th>
        <th>Tin nhắn</th>
        <th>Trạng thái</th>
        <th>Ngày</th>
      </tr>
    </thead>
    <tbody>
      ${contacts
        .map(
          (contact) => `
        <tr>
          <td><small>${contact.email}</small></td>
          <td><small>${contact.message.substring(0, 30)}...</small></td>
          <td><span class="badge bg-${getStatusColor(contact.status)}">${
            contact.status
          }</span></td>
          <td><small>${new Date(contact.createdAt).toLocaleDateString(
            "vi-VN"
          )}</small></td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  container.appendChild(table);
}

function getStatusColor(status) {
  const colors = {
    new: "secondary",
    read: "primary",
    replied: "success",
    closed: "danger",
  };
  return colors[status] || "secondary";
}

async function initDashboardPage() {
  await loadDashboardStats();
}

export { initDashboardPage };
