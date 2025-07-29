import { API_BASE_URL } from "../config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorDisplay = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      console.log("Login response:", data); // debug

      if (response.ok && data.token && data._id && data.role) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data._id);
        localStorage.setItem("role", data.role);

        if (data.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "dashboard.html";
        }
      } else {
        errorDisplay.textContent = data.message || "Login failed";
      }
    } catch (err) {
      console.error(err);
      errorDisplay.textContent = "Server error. Try again later.";
    }
  });
});
