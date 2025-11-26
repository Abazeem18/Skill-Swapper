import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

function Search() {
  const [skill, setSkill] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate(); //  Navigation hook

  useEffect(() => {
    loadUser();
  }, []);

  //  Get logged-in user
  const loadUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setUser(data.session.user);
    }
  };

  //  Search users
  const handleSearch = async () => {
    if (!skill.trim()) {
      alert("Enter a skill");
      return;
    }

    const res = await fetch(`http://localhost:5000/search-users/${skill}`);
    const data = await res.json();

    setResults(data);
  };

  //Send swap request
  const sendRequest = async (toUserId, requestedSkill) => {
    if (!user) {
      alert("Login required");
      return;
    }

    const offeredSkill = prompt("Enter the skill YOU are offering:");

    if (!offeredSkill) {
      alert("You must enter a skill");
      return;
    }

    const res = await fetch("http://localhost:5000/send-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromUser: user.id,
        toUser: toUserId,
        offeredSkill,
        requestedSkill
      })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="auth-page wide">
      <div className="auth-container wide">

        {/*  BACK BUTTON */}
        <button 
          onClick={() => navigate("/dashboard")}
          style={{
            marginBottom: "15px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 12px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer"
          }}
        >
          ← Back to Dashboard
        </button>

        <h2>Search Users by Skill</h2>

        {/*  Search Bar */}
        <input
          type="text"
          placeholder="Enter skill (React, Java, Python...)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>

        <hr />

        {/* Results */}
        {results.length === 0 && (
          <p>No results yet. Try searching a skill.</p>
        )}

        {results.map((u) => (
          <div key={u.supabaseId} className="card">
            <p><b>Email:</b> {u.email}</p>
            <p><b>Offers:</b> {u.skillsOffered.join(", ")}</p>
            <p><b>Wants:</b> {u.skillsWanted.join(", ")}</p>

            <button
              style={{ marginTop: "10px" }}
              onClick={() =>
                sendRequest(u.supabaseId, u.skillsOffered[0])
              }
            >
              Send Swap Request
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Search;
