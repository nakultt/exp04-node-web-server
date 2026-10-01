// ===== Basic web server with Node.js and Express =====
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or default to 3000
const PUBLIC_DIR = path.join(__dirname, "public");

// Request logger middleware: prints method, URL, status and response time
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next();
});

// Serve static files (HTML, CSS, JS, images) from the public directory
app.use(express.static(PUBLIC_DIR));

// Clean routes without the .html extension
app.get("/about", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "contact.html"));
});

// Small JSON endpoint showing the server is dynamic as well as static
app.get("/api/status", (req, res) => {
  res.json({
    status: "running",
    server: "Express " + require("express/package.json").version,
    node: process.version,
    uptimeSeconds: Math.round(process.uptime()),
    time: new Date().toISOString()
  });
});

// 404 handler for anything not matched above
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
