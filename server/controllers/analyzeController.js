const axios = require("axios");
const FormData = require("form-data");
const Resume = require("../models/resume");

// Helper to suggest jobs based on skills
const getJobMatches = (skills) => {
  const matches = [];
  const s = skills.map(skill => skill.toLowerCase());

  if (s.includes("python") && (s.includes("scikit-learn") || s.includes("pandas"))) matches.push("Data Scientist");
  if (s.includes("react") && s.includes("node")) matches.push("Fullstack Developer");
  if (s.includes("docker") || s.includes("kubernetes") || s.includes("aws")) matches.push("DevOps Engineer");
  if (s.includes("java") || s.includes("sql")) matches.push("Backend Engineer");
  if (s.includes("tensorflow") || s.includes("python")) matches.push("ML Engineer");

  return matches.length > 0 ? matches : ["General Developer"];
};

exports.analyzeResume = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const form = new FormData();
    
    // ✅ FIX: Use req.file.buffer instead of fs.createReadStream
    form.append("resume", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    
    form.append("jd_skills", "python,scikit-learn,sql,aws,docker,pandas");

    const mlResponse = await axios.post(
      "http://localhost:8000/predict",
      form,
      { headers: form.getHeaders() }
    );

    // Map the ML response to your Database model
    const result = {
      score: mlResponse.data.score,
      skills: mlResponse.data.skills,
      missing_skills: mlResponse.data.missing_skills,
      jobs: ["ML Engineer", "Data Scientist"] // You can make this dynamic later
    };

    const newResume = new Resume({ userId, ...result });
    await newResume.save();

    res.json(result);

  } catch (err) {
    console.error("DETAILED ERROR:", err.message);
    res.status(500).json({ error: "ML Service is likely down or unreachable" });
  }
};