export const API_BASE_URL = "https://livesmart-server.onrender.com";


// במקום export function
function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers || {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}


