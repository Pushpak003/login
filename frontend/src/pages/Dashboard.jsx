import { useNavigate } from "react-router-dom";

export default function Dashboard(){

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if(!token){
    navigate("/login");
  }

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="container">

      <div className="card">

        <h1>Dashboard</h1>

        <p>You are logged in successfully</p>

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </div>
  );
}