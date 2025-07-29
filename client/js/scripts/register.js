// פונקציית עזר שמוסיפה את הטוקן לבקשה
function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers || {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

const form = document.getElementById("registerForm");
const errorDisplay = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const role = document.getElementById("role").value;

  if (password !== confirmPassword) {
    errorDisplay.textContent = "Passwords do not match";
    return;
  }

  try {
    const res = await authFetch("https://livesmart-server.onrender.com/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("User registered successfully");
      window.location.href = "login.html";
    } else {
      errorDisplay.textContent = data.message || "Registration failed";
    }
  } catch (err) {
    errorDisplay.textContent = "Error connecting to server";
  }
});
