const API = "http://localhost:5000/api/auth";

async function register() {

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const res = await fetch(
    `${API}/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await res.json();

  alert(data.message);

  if(res.ok){

    window.location.href = "login.html";

  }

}



async function login() {

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const res = await fetch(
    `${API}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await res.json();

  alert(data.message);

  if(data.token){

    localStorage.setItem(
      "token",
      data.token
    );

    window.location.href =
      "dashboard.html";

  }

}