const BASE_URL = "http://localhost:5001";

async function apiRequest(endpoint, method = "GET", body = null, isFile = false) {
  const token = localStorage.getItem("token");

  const headers = isFile
    ? { Authorization: token }
    : {
        "Content-Type": "application/json",
        Authorization: token
      };

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = isFile ? body : JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    alert("Something went wrong");
  }
}

window.apiRequest = apiRequest;