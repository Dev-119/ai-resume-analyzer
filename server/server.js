console.log("Starting server...");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

const authRoutes = require("./routes/authRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();
const PORT = process.env.PORT;

// Debug logger
app.use((req, res, next) => {
    console.log(`Incoming: ${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Server alive ");
});

app.use("/auth", authRoutes);
app.use("/api", analyzeRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
    console.error("Server error:", err);
});