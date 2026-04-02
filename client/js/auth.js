/* TOKEN  */

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
}

/*  JWT PARSE */

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

/*  NAVBAR */

function updateNavbar() {
  const authDiv = document.querySelector(".auth-buttons");
  const token = getToken();

  if (!authDiv) return;

  if (token) {
    const payload = parseJwt(token);

    authDiv.innerHTML = `
      <span>Hi, ${payload?.name || "User"} 👋</span>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    authDiv.innerHTML = `
      <button onclick="window.location.href='login.html'" class="login">Login</button>
      <button onclick="window.location.href='signup.html'" class="signup">Sign Up</button>
    `;
  }
}

/*  LOGOUT */

function logout() {
  removeToken();
  location.reload();
}

/* AUTH GUARD */

function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
  }
}

/* LOGIN */

async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = await apiRequest("/auth/login", "POST", { email, password });

  if (data?.token) {
    setToken(data.token);
    window.location.href = "index.html";
  } else {
    alert(data?.message || "Login failed");
  }
}

/* SIGNUP  */

async function signupUser() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = await apiRequest("/auth/signup", "POST", {
    name,
    age,
    email,
    password
  });

  if (data?.message) {
    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  } else {
    alert(data?.message || "Signup failed");
  }
}

/* AUTO INIT */

document.addEventListener("DOMContentLoaded", updateNavbar);

/* make global */
window.loginUser = loginUser;
window.signupUser = signupUser;
window.logout = logout;
window.requireAuth = requireAuth;