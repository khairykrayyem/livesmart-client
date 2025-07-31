import { authFetch, API_BASE_URL } from '../config.js';



document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "User";
  document.getElementById("user-name").innerText = `Hi ${userName}`;

  if (!userId) {
    alert("User not logged in.");
    return;
  }

  loadRooms(userId);
});

async function loadRooms(userId) {
  try {
    const response = await authFetch(`${API_BASE_URL}/api/rooms?userId=${userId}`);
    const rooms = await response.json();

    const container = document.getElementById("rooms-container");
    container.innerHTML = "";

    rooms.forEach(room => {
      const card = document.createElement("div");
      card.className = "room-card";
      card.innerHTML = `
        <img src="../images/${room.image || 'startBG.jpeg'}" alt="${room.name}">
        <h3>${room.name}</h3>
        <p>${room.devices?.length || 0} Devices</p>
      `;
      container.appendChild(card);
    });

    // כפתור "View All"
    const viewAll = document.createElement("div");
    viewAll.className = "room-card view-all";
    viewAll.textContent = "View All";
    container.appendChild(viewAll);

  } catch (error) {
    console.error("Failed to load rooms:", error);
  }
}
