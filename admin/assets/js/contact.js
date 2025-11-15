import { URL_LOCAL } from "./config.js";
const url = URL_PROD;

const statusEnum = ["new", "read", "replied", "closed"];
const statusClass = {
  new: "btn-secondary",
  read: "btn-primary",
  replied: "btn-success",
  closed: "btn-danger",
};

let contactsContainer;
let initialized = false;

async function loadContacts() {
  try {
    const res = await fetch(`${url}/api/contacts`);
    if (!res.ok) throw new Error("Failed to fetch contacts");
    const contacts = await res.json();
    renderContacts(contacts);
  } catch (err) {
    console.error(err);
  }
}

function renderContacts(contacts) {
  const container = document.getElementById("contacts-container");
  container.innerHTML = "";

  contacts.forEach((contact) => {
    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    const nameDiv = document.createElement("div");
    nameDiv.textContent = "Email: " + contact.email;
    nameDiv.className = "mb-2 text-primary";

    const contentDiv = document.createElement("div");
    contentDiv.textContent = "Message: " + contact.message;
    contentDiv.className = "mb-2";

    const statusContainer = document.createElement("div");
    statusContainer.className = "d-flex gap-2 flex-wrap";

    statusEnum.forEach((status) => {
      const btn = document.createElement("button");
      btn.textContent = status;
      btn.className = `btn btn-sm ${
        contact.status === status
          ? statusClass[status]
          : "btn-outline-secondary"
      }`;
      btn.addEventListener("click", () => {
        updateStatus(contact._id, status);
      });
      statusContainer.appendChild(btn);
    });

    card.appendChild(nameDiv);
    card.appendChild(contentDiv);
    card.appendChild(statusContainer);
    container.appendChild(card);
  });
}

async function updateStatus(id, status) {
  try {
    const res = await fetch(`${url}/api/contacts/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error(err.message);
      return;
    }
    await loadContacts();
  } catch (err) {
    console.error(err);
  }
}

async function initContactsPage() {
  if (!initialized) {
    contactsContainer = document.getElementById("contacts-container");
    if (!contactsContainer) {
      console.error("Contacts container not found");
      return;
    }
    initialized = true;
  }

  await loadContacts();
}

export { initContactsPage };
