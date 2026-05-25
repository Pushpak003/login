import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5000/api/auth";

export default function Register(){

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

  const register = async () => {

    const res = await fetch(`${API}/register`, {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(formData)
    });

    const data = await res.json();

    alert(data.message);

    if(res.ok){
      navigate("/login");
    }
  };

  return (
    <div className="container">

      <div className="card">

        <h1>Create Account</h1>

        <p>Register to continue</p>

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

        <button onClick={register}>
          Register
        </button>

        <p style={{marginTop:"20px"}}>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>

    </div>
  );
}