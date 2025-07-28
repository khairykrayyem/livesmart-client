document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5000/api/devices") // ודא שזו הכתובת הנכונה
    .then(res => res.json())
    .then(devices => {
      const list = document.getElementById("device-list");

      devices.forEach(device => {
        const card = document.createElement("div");
        card.className = "device-card";
        card.innerHTML = `
          <h3>${device.name}</h3>
          <p><strong>Type:</strong> ${device.type}</p>
          <p><strong>Status:</strong> ${device.status}</p>
          <p><strong>Room:</strong> ${device.roomName || "N/A"}</p>
        `;
        list.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Failed to load devices:", err);
    });
});
