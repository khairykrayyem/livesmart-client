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
  loadWeather(); 
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
        <img src="/images/${room.image || 'startBG.jpeg'}" alt="${room.name}">
        <h3>${room.name}</h3>
        <p>${room.devices?.length || 0} Devices</p>
      `;
                // מיד אחרי card.innerHTML = `...` ובטרם container.appendChild(card);
          const addBtn = document.createElement('button');
          addBtn.className = 'add-device-btn';
          addBtn.title = 'Add device';
          addBtn.textContent = '＋';
          addBtn.dataset.roomId = room._id; // חשוב: מזהה החדר
          card.appendChild(addBtn);

      container.appendChild(card);
    });
        // מאזין לכפתור ה-+ (השורה יכולה להישאר במקום שבו יש לך אותה היום)
document.getElementById('add-room-btn')?.addEventListener('click', onAddRoomClick);

async function onAddRoomClick() {
  const userId = localStorage.getItem('userId'); // רק לריענון אחרי יצירה
  if (!userId) {
    alert('User not logged in.');
    return;
  }

  // בהתאם ל-API של השרת: name, floor, type
  const name = prompt('Room name');
  if (!name || !name.trim()) return;

  const floorStr = prompt('Floor number (e.g., 1)');
  const floor = Number.parseInt(floorStr, 10);
  if (Number.isNaN(floor)) {
    alert('Floor must be a number');
    return;
  }

  const type = prompt('Room type (e.g., bedroom, kitchen, living)');
  if (!type || !type.trim()) return;

  try {
    const res = await authFetch(`${API_BASE_URL}/api/rooms`, {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        floor,
        type: type.trim()
      })
    });

    if (res.status !== 201 && res.status !== 200) {
      const text = await res.text();
      throw new Error(`Unexpected status ${res.status}: ${text}`);
    }

    // רענון הרשימה אחרי יצירה מוצלחת
    await loadRooms(userId);
  } catch (err) {
    console.error('Failed to add room:', err);
    alert('Failed to add room: ' + err.message);
  }
}


    // כפתור "View All"
    const viewAll = document.createElement("div");
    viewAll.className = "room-card view-all";
    viewAll.textContent = "View All";
    container.appendChild(viewAll);

  } catch (error) {
    console.error("Failed to load rooms:", error);
  }
}
// Delegation: קליק על כפתור ה-＋ בתוך #rooms-container
document.getElementById("rooms-container")?.addEventListener("click", async (e) => {
  const btn = e.target.closest(".add-device-btn");
  if (!btn) return;

  const roomId = btn.dataset.roomId;

  // אם יש מודאל ב-HTML (add-device-modal) נשתמש בו; אחרת ניפול ל-prompt
  if (typeof openDeviceModal === 'function' && openDeviceModal(roomId)) return;

  const name = prompt("Device name");
  if (!name?.trim()) return;

  const type = prompt("Device type (e.g., camera, ac, vacuum)");
  if (!type?.trim()) return;

  await submitDevice({ roomId, name: name.trim(), type: type.trim() });
});

// פונקציה שמבצעת את הקריאה לשרת (תואם ל-API הקיים: POST /api/devices)
async function submitDevice({ roomId, name, type }) {
  try {
    const res = await authFetch(`${API_BASE_URL}/api/devices`, {
      method: 'POST',
      body: JSON.stringify({ roomId, name, type })
    });

    if (res.status === 201) {
      alert('Device created ✅');
    } else if (res.status === 202) {
      alert('Request sent to admin ✅');
    } else {
      const msg = await res.text();
      throw new Error(`Unexpected status ${res.status}: ${msg}`);
    }

    const userId = localStorage.getItem('userId');
    if (userId) await loadRooms(userId); // רענון מונה המכשירים
  } catch (err) {
    console.error('Device request failed:', err);
    alert('Failed to send request: ' + err.message);
  }
}

// --- Weather ---
async function loadWeather() {
  const widget = document.getElementById("weather");
  if (!widget) return;
  try {
    // דוגמה: lat/lon קבועים (תל אביב) – אפשר להחליף לעיר מה-LS
    const res = await fetch(`${API_BASE_URL}/weather?city=Tel Aviv`);
    const w   = await res.json();
    widget.querySelector('.city').textContent = w.city || 'Weather';
    widget.querySelector('.temp').textContent = `${w.temperature}°C`;
  } catch (e) {
    console.error('weather', e);
  }
}
