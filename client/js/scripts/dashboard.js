import { authFetch, API_BASE_URL } from '../config.js';

document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadDevices();
  loadRooms();
});

async function loadUsers() {
  try {
    const res = await authFetch(`${API_BASE_URL}/api/users`);
    const users = await res.json();

    if (!Array.isArray(users)) throw new Error("Expected array");

    const container = document.getElementById("usersContainer");
    container.innerHTML = ""; // clear previous content

    users.forEach(user => {
      const div = document.createElement("div");
      div.className = "user-card";
      div.textContent = user.username;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load users", err);
  }
}

async function loadDevices() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await authFetch(`${API_BASE_URL}/api/devices?userId=${userId}`);
    const devices = await res.json();

    if (!Array.isArray(devices)) throw new Error("Expected array");

    const container = document.getElementById("devicesContainer");
    container.innerHTML = "";

    devices.forEach(device => {
      const div = document.createElement("div");
      div.className = "device-card";
      div.innerHTML = `
        <h4>${device.name}</h4>
        <p>Type: ${device.type}</p>
        <p>Room: ${device.room}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load devices", err);
  }
}

async function loadRooms() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await authFetch(`${API_BASE_URL}/api/rooms?userId=${userId}`);
    const rooms = await res.json();

    if (!Array.isArray(rooms)) throw new Error("Expected array");

    const container = document.getElementById("roomsContainer");
    container.innerHTML = "";

    rooms.forEach(room => {
      const div = document.createElement("div");
      div.className = "room-card";
      div.innerHTML = `
        <h4>${room.name}</h4>
        <p>Type: ${room.type}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load rooms", err);
  }
}
