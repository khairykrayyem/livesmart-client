// client/js/add-device.js

document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");
  const roomSelect = document.getElementById("roomSelect");
  const form = document.getElementById("deviceForm");
  const message = document.getElementById("message");

  // שלב א': טען את החדרים של המשתמש
  try {
    const res = await fetch(`${API_BASE_URL}/api/users`)
;
    const rooms = await res.json();

    rooms.forEach(room => {
      const option = document.createElement("option");
      option.value = room._id;
      option.textContent = room.name;
      roomSelect.appendChild(option);
    });
  } catch (error) {
    message.textContent = "Failed to load rooms.";
    console.error(error);
  }

  // שלב ב': שלח את המכשיר לשרת
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const deviceData = {
      name: form.deviceName.value,
      type: form.deviceType.value,
      roomId: form.roomSelect.value,
      userId: userId
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deviceData)
      });

      if (res.ok) {
        message.textContent = "Device added successfully!";
        form.reset();
      } else {
        const data = await res.json();
        message.textContent = data.message || "Failed to add device.";
      }
    } catch (error) {
      message.textContent = "Error connecting to server.";
      console.error(error);
    }
  });
});
