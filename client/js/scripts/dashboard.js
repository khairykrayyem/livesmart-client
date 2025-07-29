document.addEventListener('DOMContentLoaded', async () => {
  await loadUsers();
  await loadDevices();
  await loadRooms();
});

async function loadUsers() {
  const res = await fetch(`${API_BASE_URL}/api/users`);
  const users = await res.json();
  const container = document.getElementById('smart-users-container');
  users.forEach(user => {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = user.firstName + ' ' + user.lastName;
    container.appendChild(div);
  });
}

async function loadDevices() {
  const res = await fetch(`${API_BASE_URL}/api/users`);
  const devices = await res.json();
  const container = document.getElementById('devices-container');
  devices.forEach(device => {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = device.name;
    container.appendChild(div);
  });
}

async function loadRooms() {
  const res = await fetch(`${API_BASE_URL}/api/users`);
  const rooms = await res.json();
  const container = document.getElementById('rooms-container');
  rooms.forEach(room => {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = room.name;
    container.appendChild(div);
  });
}
