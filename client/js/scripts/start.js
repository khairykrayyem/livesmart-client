document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("registerBtn").addEventListener("click", () => {
    window.location.href = "register.html";
  });

  document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = "login.html";
  });

fetch("https://livesmart-server.onrender.com/")
  .then(res => res.text()) 
  .then(data => {
    console.log("✅ Server connected:", data);
  })
  .catch(err => {
    console.error("❌ Server connection failed:", err);
  });

});
