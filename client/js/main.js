console.log("Main JS Loaded ");

document.addEventListener("DOMContentLoaded", () => {
  requireAuth();

  const fileInput = document.getElementById("resumeInput");
  const fileNameDisplay = document.getElementById("fileName");

  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      fileNameDisplay.innerText =
        file
          ? `${file.name} (${(file.size / 1024).toFixed(1)} KB)`
          : "No file chosen";
    });
  }

  loadHistory();
});

/*  UPLOAD */

async function uploadResume() {
  const fileInput = document.getElementById("resumeInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Upload resume first");
    return;
  }

  const formData = new FormData();
  formData.append("resume", file);

  const data = await apiRequest("/api/analyze", "POST", formData, true);

  if (data) {
    displayResults(data);
    loadHistory();
  }
}

/* DISPLAY RESULTS */

function displayResults(data) {
  console.log("API Response received:", data);

  // 1. Show the section first
  const resultSection = document.getElementById("resultSection");
  if (resultSection) resultSection.classList.remove("hidden");

  // 2. Safely parse and animate score
  const scoreValue = data && data.score !== undefined ? Number(data.score) : 0;
  animateScore(scoreValue);

  // 3. Helper to safely clear and fill containers
  const updateContainer = (id, items, colorClass = "") => {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = ""; // Clear old data
    
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        const span = document.createElement("span");
        span.textContent = item;
        if (colorClass) span.className = colorClass;
        container.appendChild(span);
      });
    }
  };

  // 4. Update the UI components
  updateContainer("skills", data.skills);
  updateContainer("missingSkills", data.missing_skills, "missing-tag");
  
  // 5. Update Jobs (List items instead of spans)
  const jobsList = document.getElementById("jobs");
  if (jobsList) {
    jobsList.innerHTML = "";
    if (data.jobs && Array.isArray(data.jobs)) {
      data.jobs.forEach(job => {
        const li = document.createElement("li");
        li.textContent = job;
        jobsList.appendChild(li);
      });
    }
  }
}

/* SCORE */

/* SCORE ANIMATION - SAFE VERSION */
let scoreInterval = null;

function animateScore(targetValue) {
  const element = document.getElementById("score");
  
  // 1. Force target to be a clean number (handles strings/decimals)
  const target = Math.round(parseFloat(targetValue)) || 0;

  element.innerText = "0%"; 

  // 2. Clear any existing animation to prevent "speed-up" bugs
  if (scoreInterval) {
    clearInterval(scoreInterval);
  }

  let current = 0;

  // 3. If target is 0, just stop immediately
  if (target <= 0) {
    element.innerText = "0%";
    return;
  }

  scoreInterval = setInterval(() => {
    current++;

    // 4. Boundary Check: Stop if we hit OR pass the target
    if (current >= target) {
      clearInterval(scoreInterval);
      element.innerText = target + "%";
    } else {
      element.innerText = current + "%";
    }
  }, 15); // Slightly slower for better visual tracking
}
/* HISTORY  */

async function loadHistory() {
  const data = await apiRequest("/api/history");
  if (data) displayHistory(data);
}

/* DISPLAY HISTORY  */

function displayHistory(history) {
  const historySection = document.getElementById("historySection");
  const historyList = document.getElementById("historyList");

  historySection.classList.remove("hidden");
  historyList.innerHTML = "";

  history.forEach(item => {
    const card = document.createElement("div");
    card.className = "history-card";

    card.innerHTML = `
      <h3>Score: ${item.score}%</h3>
      <p><strong>Jobs:</strong> ${item.jobs.join(", ")}</p>
      <div>${item.skills.map(s => `<span>${s}</span>`).join("")}</div>
      <small>${new Date(item.createdAt).toLocaleString()}</small>
    `;

    historyList.appendChild(card);
  });
}


window.uploadResume = uploadResume;