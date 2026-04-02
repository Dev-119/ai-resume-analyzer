const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const { analyzeResume } = require("../controllers/analyzeController");

const Resume = require("../models/resume");

// ANALYZE ROUTE
router.post("/analyze", auth, upload.single("resume"), analyzeResume);

// HISTORY ROUTE
router.get("/history", auth, async (req, res) => {
  try {
    console.log("USER:", req.user);

    const resumes = await Resume.find({ userId: req.user.userId });

    res.json(resumes);

  } catch (err) {
    console.error(" HISTORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;