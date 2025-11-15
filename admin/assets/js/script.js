import { URL_PROD, URL_LOCAL } from "./config.js";

const url = URL_PROD;

const form = document.getElementById("loginForm");
form.addEventListener("submit", async (e) => {
  // nếu ko co e.preventDefault(); ngăn reload trang nó sẽ tạo url index.html?username=username&password=pass chứa query string lộ tk mk,
  //  chỉ dùng query string cho bộ lọc,tìm kiếm, sort giá, ngày tạo,... -->
  e.preventDefault();

  const data = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };
  const result = await checkLogin(data);
  if (result.token) {
    localStorage.setItem("token", result.token);
    window.location.href = "/admin.html";
  }
});

const checkLogin = async (data) => {
  const res = await fetch(`${url}/api/admins/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const rs = await res.json();
  return rs;
};
