// בדיקה אם המשתמש מחובר
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

if (!token || !userId) {
  alert("User not logged in.");
  window.location.href = "login.html";
}

// הפונקציה הכללית שלנו
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

// טעינת יוזרים
async function loadUsers() {
  try {
    const res = await authFetch("https://livesmart-server.onrender.com/api/users");
    const users = await res.json();

    if (!Array.isArray(users)) throw new Error("Expected array");

    const usersContainer = document.getElementById("usersContainer");
    usersContainer.innerHTML = "";

    users.forEach(user => {
      const img = document.createElement("img");
      img.src = "../images/profilepic1.jpeg"; // אפשר להחליף לדינמי בעתיד
      img.alt = user.username;
      img.className = "user-avatar";
      usersContainer.appendChild(img);
    });
  } catch (err) {
    console.error("Failed to load users", err);
  }
}

// טעינת חדרים
async function loadRooms() {
  try {
    const res = await authFetch(`https://livesmart-server.onrender.com/api/rooms?userId=${userId}`);
    const rooms = await res.json();

    if (!Array.isArray(rooms)) throw new Error("Expected array");

    const roomsContainer = document.getElementById("roomsContainer");
    roomsContainer.innerHTML = "";

    rooms.forEach(room => {
      const div = document.createElement("div");
      div.className = "room-card";
      div.innerHTML = `
        <h4>${room.name}</h4>
        <p>${room.devices.length} devices</p>
      `;
      roomsContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load rooms", err);
  }
}

// טעינת מכשירים
async function loadDevices() {
  try {
    const res = await authFetch(`https://livesmart-server.onrender.com/api/devices?userId=${userId}`);
    const devices = await res.json();

    if (!Array.isArray(devices)) throw new Error("Expected array");

    const devicesContainer = document.getElementById("devicesContainer");
    devicesContainer.innerHTML = "";

    devices.forEach(device => {
      const div = document.createElement("div");
      div.className = "device-card";
      div.innerHTML = `
        <h4>${device.name}</h4>
        <p>Status: ${device.status}</p>
      `;
      devicesContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load devices", err);
  }
}

// טעינה בהפעלה
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadRooms();
  loadDevices();
});
