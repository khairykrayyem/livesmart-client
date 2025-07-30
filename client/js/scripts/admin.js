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

    const container = document.querySelector(".users");
    container.innerHTML = "";

    users.forEach(user => {
      const img = document.createElement("img");
      img.src = "../images/user1.jpeg"; // או דינמי אם יש תמונה בשרת
      img.alt = user.username;
      container.appendChild(img);
    });
  } catch (err) {
    console.error("Error loading users", err);
  }
}
window.togglePopup = function(id) {
  const popup = document.getElementById(id);
  popup.style.display = popup.style.display === "block" ? "none" : "block";
};


async function loadDevices() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await authFetch(`${API_BASE_URL}/api/devices?userId=${userId}`);
    const devices = await res.json();

    const container = document.querySelector(".device-buttons");
    container.innerHTML = "";

    devices.forEach((device, index) => {
      const div = document.createElement("div");
      div.className = `device ${index === 1 ? "active" : ""}`;
      div.innerHTML = `
        <img src="../images/ac.device.jpeg" alt="${device.name}" />
        <span>${device.name}</span>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading devices", err);
  }
}

async function loadRooms() {
  try {
    const userId = localStorage.getItem("userId");
    const res = await authFetch(`${API_BASE_URL}/api/rooms?userId=${userId}`);
    const rooms = await res.json();

    const container = document.querySelector(".room-list");
    container.innerHTML = "";

    rooms.forEach(room => {
      const div = document.createElement("div");
      div.className = "room";
      div.innerHTML = `
        <img src="../images/startBG.jpeg" />
        <div class="overlay">
          <p>${room.name}</p>
          <span>${room.devices?.length || 0}/${room.capacity || 10}</span>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading rooms", err);
  }

}
