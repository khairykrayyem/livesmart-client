// client/js/rooms.js

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("roomsContainer");

  try {
    // כאן תכניס את ה־userId לפי איך שאתה שומר אותו (למשל מ-localStorage)
    const userId = localStorage.getItem("userId");

    const res = await fetch(`${API_BASE_URL}/api/users`);
    const rooms = await res.json();

    if (rooms.length === 0) {
      container.innerHTML = "<p>No rooms found.</p>";
      return;
    }

    rooms.forEach(room => {
      const roomDiv = document.createElement("div");
      roomDiv.classList.add("room-card");
      roomDiv.innerHTML = `
        <h3>${room.name}</h3>
        <p>ID: ${room._id}</p>
      `;
      container.appendChild(roomDiv);
    });

  } catch (error) {
    console.error("Failed to load rooms:", error);
    container.innerHTML = "<p>Failed to load rooms.</p>";
  }
});
