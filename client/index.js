fetch("https://livesmart-server.onrender.com/")
  .then(res => res.text()) 
  .then(data => {
    console.log("✅ Server connected:", data);
  })
  .catch(err => {
    console.error("❌ Server connection failed:", err);
  });

