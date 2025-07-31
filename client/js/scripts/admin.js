import { authFetch, API_BASE_URL } from '../config.js';

document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadDevices();
  loadRooms();
  loadDeviceRequests()
  initAddUserModal()
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
// ---- Device Requests (Admin) ----
async function loadDeviceRequests() {
  try {
    const res = await authFetch(`${API_BASE_URL}/api/device-requests`);

    const requests = await res.json();

    const list = document.getElementById("requests-list");
    if (!list) return;

    list.innerHTML = "";
    if (!Array.isArray(requests) || requests.length === 0) {
      list.innerHTML = `<div class="muted">No pending requests.</div>`;
      return;
    }

    requests.forEach(req => {
      const item = document.createElement("div");
      item.className = "request-item";
      item.innerHTML = `
        <div class="info">
          <div class="title">${req.name} <span class="type">(${req.type})</span></div>
          <div class="meta">Room: ${req.roomId || '-' } • By: ${req.requestedByName || req.requestedBy || 'user'}</div>
        </div>
        <div class="actions">
          <button class="approve" data-id="${req._id}" data-action="approve">Approve</button>
          <button class="reject"  data-id="${req._id}" data-action="reject">Reject</button>
        </div>
      `;
      list.appendChild(item);
    });
  } catch (err) {
    console.error("Error loading device requests", err);
    const list = document.getElementById("requests-list");
    if (list) list.innerHTML = `<div class="error">Failed to load requests</div>`;
  }
}

// האזנה לפעולות אישור/דחייה (delegation)
document.getElementById("requests-list")?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action; // approve | reject
  btn.disabled = true;

  try {
    const res = await authFetch(`${API_BASE_URL}/api/device-requests/${id}/${action}`, {
      method: "POST"
    });
    if (res.ok) {
      await loadDeviceRequests(); // רענון הרשימה
      // אפשר גם לרענן devices/rooms אם ברצונך לראות שינוי מיידי
      // await loadDevices();
      // await loadRooms();
    } else {
      const msg = await res.text();
      alert(`Failed to ${action}: ${msg}`);
    }
  } catch (err) {
    console.error(`Error on ${action}`, err);
    alert(`Failed to ${action}: ${err.message}`);
  } finally {
    btn.disabled = false;
  }
});

function initAddUserModal() {
  const openBtn  = document.querySelector('.users-section .edit-btn[data-popup="user-popup"]');
  const modal    = document.getElementById('add-user-modal');
  const form     = document.getElementById('add-user-form');
  const cancel   = document.getElementById('au-cancel');
  const submit   = document.getElementById('au-submit');

  if (!openBtn || !modal || !form) return;

  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('au-username')?.focus();
  });

  cancel?.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    form.reset();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('au-username')?.value.trim();
    const email    = document.getElementById('au-email')?.value.trim();
    const password = document.getElementById('au-password')?.value;
    const role     = document.getElementById('au-role')?.value || 'user';
    if (!username || !email || !password) return;

    try {
      submit.disabled = true;
      const res = await authFetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        body: JSON.stringify({ username, email, password, role })
      });

      if (res.status === 201 || res.status === 200) {
        // הצלחה: סגור מודאל, נקה טופס, רענן רשימת משתמשים
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        form.reset();
        await loadUsers?.();
        alert('User created ✅');
      } else {
        const msg = await res.text();
        alert(`Failed to create user: ${msg}`);
      }
    } catch (err) {
      console.error('Add user failed:', err);
      alert('Failed to create user: ' + err.message);
    } finally {
      submit.disabled = false;
    }
  });
}
