import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../Auth.css";

function SkillProfile() {
  const [user, setUser] = useState(null);
  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [offeredList, setOfferedList] = useState([]);
  const [wantedList, setWantedList] = useState([]);

  useEffect(() => {
    fetchSessionUser();
  }, []);

  // ✅ Get logged-in user from Supabase
  const fetchSessionUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error.message);
        return;
      }

      if (!data.session || !data.session.user) {
        console.log("No user session found");
        return;
      }

      setUser(data.session.user);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // ✅ Add offered skill
  const addOfferedSkill = () => {
    if (skillOffered.trim() !== "") {
      setOfferedList([...offeredList, skillOffered]);
      setSkillOffered("");
    }
  };

  // ✅ Add wanted skill
  const addWantedSkill = () => {
    if (skillWanted.trim() !== "") {
      setWantedList([...wantedList, skillWanted]);
      setSkillWanted("");
    }
  };

  // ✅ Save skills to backend
  const saveSkillsToBackend = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/save-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          supabaseId: user.id,
          email: user.email,
          skillsOffered: offeredList,
          skillsWanted: wantedList
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Error: " + data.message);
        return;
      }

      alert("✅ Skills saved successfully!");

      // Redirect to dashboard
      window.location.href = "/dashboard";

    } catch (error) {
      console.error("Frontend error:", error);
      alert("❌ Failed to save skills");
    }
  };

  return (
    <div className="auth-page wide">
      <div className="auth-container wide">


        <h2>Add Your Skills</h2>

        {user ? (
          <p><b>Email:</b> {user.email}</p>
        ) : (
          <p>No user logged in</p>
        )}

        <h3>Skills You Offer</h3>
        <input
          type="text"
          placeholder="e.g. Java, Python"
          value={skillOffered}
          onChange={(e) => setSkillOffered(e.target.value)}
        />
        <button onClick={addOfferedSkill}>Add Offered Skill</button>

        <ul>
          {offeredList.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>

        <h3>Skills You Want</h3>
        <input
          type="text"
          placeholder="e.g. React, MongoDB"
          value={skillWanted}
          onChange={(e) => setSkillWanted(e.target.value)}
        />
        <button onClick={addWantedSkill}>Add Wanted Skill</button>

        <ul>
          {wantedList.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>

        {/* ✅ Save Button */}
        <button
          onClick={saveSkillsToBackend}
          style={{
            marginTop: "15px",
            backgroundColor: "#007bff",
            color: "white"
          }}
        >
          Save My Skills
        </button>

      </div>
    </div>
  );
}

export default SkillProfile;
