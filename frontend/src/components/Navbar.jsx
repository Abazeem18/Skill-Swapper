import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{
      width: "100%",
      background: "#007bff",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white"
    }}>
      <h3 style={{ margin: 0 }}>Skill Swapper</h3>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>Dashboard</span>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/search")}>Search</span>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/requests")}>Requests</span>
        <span style={{ cursor: "pointer" }} onClick={handleLogout}>Logout</span>
        {user && <span style={{ fontSize: "14px" }}>{user.email}</span>}
      </div>
    </div>
  );
}

export default Navbar;
