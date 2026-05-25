import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5000/api/auth";

export default function Login(){

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email:"",
    password:""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const login = async () => {

    const res = await fetch(`${API}/login`, {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(formData)
    });

    const data = await res.json();

    alert(data.message);

    if(data.token){

      localStorage.setItem(
        "token",
        data.token
      );

      navigate("/dashboard");
    }
  };

  return (
    <div className="container">

      <div className="card">

        <h1>Welcome Back</h1>

        <p>Login to your account</p>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
        />

        <button onClick={login}>
          Login
        </button>

        <p style={{marginTop:"20px"}}>
          Don't have an account?
          <Link to="/"> Register</Link>
        </p>

      </div>

    </div>
  );
}