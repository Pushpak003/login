const API = "http://localhost:5000/api/auth";

async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    alert(data.message);
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"  
        },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json(); 
      if(data.token){
    localStorage.setItem("token", data.token);
  }

  alert(data.message);
} 