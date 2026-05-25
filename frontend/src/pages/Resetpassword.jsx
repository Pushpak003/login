import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/auth";

export default function ResetPassword(){

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const resetPassword = async () => {

    const res = await fetch(
      `${API}/reset-password`,
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          token,
          password
        })
      }
    );

    const data = await res.json();

    alert(data.message);

    if(res.ok){
      navigate("/login");
    }
  };

  return (
    <div className="container">

      <div className="card">

        <h1>Reset Password</h1>

        <p>Create a new password</p>

        <input
          type="password"
          placeholder="New Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={resetPassword}>
          Reset Password
        </button>

      </div>

    </div>
  );
}