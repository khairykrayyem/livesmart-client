// dashboard.js – loads data & renders KPIs, table, and chart
import { authFetch, API_BASE_URL } from "/js/config.js";

// ---- DOM refs ----
const elUsers   = document.getElementById("count-users");
const elRooms   = document.getElementById("count-rooms");
const elDevices = document.getElementById("count-devices");
const tbody     = document.querySelector("#activity-table tbody");
let chart;

// bootstrap
init();

async function init() {
  try {
    await Promise.all([loadKPIs(), loadActivity()]);
    await loadChart();
  } catch (err) {
    console.error("Dashboard init failed", err);
  }
  // auto‑refresh every minute
  setInterval(refreshLive, 60_000);
}

async function refreshLive() {
  await Promise.all([loadKPIs(), loadActivity()]);
}

// ---- KPI cards ----
async function loadKPIs() {
  const [u, r, d] = await Promise.all([
    count("users"),
    count("rooms"),
    count("devices")
  ]);
  elUsers.textContent   = u;
  elRooms.textContent   = r;
  elDevices.textContent = d;
}
async function count(entity) {
  const res = await authFetch(`${API_BASE_URL}/api/${entity}/count`);
  const { count } = await res.json();
  return count;
}

// ---- Activity Table ----
async function loadActivity() {
  const res = await authFetch(`${API_BASE_URL}/api/devices/activity?limit=10`);
  const list = await res.json();
  tbody.innerHTML = "";
  list.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.deviceName}</td>
      <td>${a.roomName}</td>
      <td>${a.username}</td>
      <td>${a.state}</td>
      <td>${new Date(a.timestamp).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });
}

// ---- Chart ----
async function loadChart() {
  const res = await authFetch(`${API_BASE_URL}/api/devices/usage`);
  const data = await res.json(); // [{date: '2025-07-01', count: 3}, ...]
  const labels = data.map(d => d.date);
  const counts = data.map(d => d.count);

  const ctx = document.getElementById("chart-devices").getContext("2d");
  if (!chart) {
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{ label: "Devices per Day", data: counts, fill: false }]
      },
      options: { responsive: true, tension: 0.3, plugins: { legend: { display: false } } }
    });
  } else {
    chart.data.labels = labels;
    chart.data.datasets[0].data = counts;
    chart.update();
  }
}

// ---- Logout ----
const btnLogout = document.getElementById("logout");
btnLogout?.addEventListener("click", () => {
  localStorage.clear();
  location.href = "/login.html";
});
