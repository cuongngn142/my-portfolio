import { URL_PROD, URL_LOCAL } from "./config.js";

const url = URL_PROD;

async function loadListAccount() {
  const container = document.querySelector(".card-item");
  if (!container) return console.error("Card item element not found!");

  container.innerHTML = "";

  try {
    const res = await fetch(`${url}/api/admins`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Error fetching accounts:", err.message);
      return;
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return;
    }

    data.forEach((dt) => {
      const accountDiv = document.createElement("div");
      accountDiv.className =
        "d-flex align-items-center me-3 mb-2 p-2 border rounded";

      const userName = document.createElement("div");
      userName.className = "me-3 fw-bold";
      userName.textContent = dt.username;

      const role = document.createElement("div");
      role.className = "me-3 text-muted";
      role.textContent = dt.role;

      const createdAt = document.createElement("div");
      createdAt.className = "me-3 text-muted";
      createdAt.textContent = new Date(dt.createdAt).toLocaleString();

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-danger btn-sm ms-auto btn-delete";
      delBtn.textContent = "Delete";
      delBtn.dataset.id = dt._id;

      accountDiv.appendChild(userName);
      accountDiv.appendChild(role);
      accountDiv.appendChild(createdAt);
      accountDiv.appendChild(delBtn);

      container.appendChild(accountDiv);
    });
    deleteAccount();
  } catch (err) {
    console.error(err);
  }
}

loadListAccount();
export function initAccountsPage() {
  const saveBtn = document.getElementById("saveBtn");
  const notifyName = document.querySelector(".notify-name");
  const notifyPass = document.querySelector(".notify-pass");

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("res-username");
    const passInput = document.getElementById("res-password");
    const name = nameInput.value.trim();
    const pass = passInput.value.trim();

    notifyName.textContent = "";
    notifyPass.textContent = "";

    if (!name) {
      notifyName.textContent = "Username không được để trống";
      return;
    }
    if (!pass) {
      notifyPass.textContent = "Password không được để trống";
      return;
    }

    const data = { username: name, password: pass };
    const exists = await checkAccountExists(name);
    if (exists) {
      notifyName.textContent = "Username đã tồn tại";
      return;
    }

    await createAccount(data);
    loadListAccount();

    nameInput.value = "";
    passInput.value = "";
  });
}
async function checkAccountExists(username) {
  try {
    const res = await fetch(`${url}/api/admins/username/${username}`);
    const rs = await res.json();
    return rs.username ? true : false;
  } catch (err) {
    console.error(err);
  }
}

async function createAccount(data) {
  try {
    const res = await fetch(`${url}/api/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const rs = await res.json();
  } catch (err) {
    console.error(err);
  }
}

initAccountsPage();

async function deleteAccount() {
  const btns = document.querySelectorAll(".btn-delete");
  btns.forEach((b) => {
    b.addEventListener("dblclick", async () => {
      const id = b.dataset.id;
      try {
        const res = await fetch(`${url}/api/admins/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const rs = await res.json();
        console.log(rs.message);
        loadListAccount();
      } catch (err) {
        console.error(err);
      }
    });
  });
}
