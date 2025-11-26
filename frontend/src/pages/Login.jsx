import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import "../Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    //  Get Supabase user ID
    const supabaseId = data.user.id;

    try {
      // Check if user already has skills
      const response = await fetch(
        `http://localhost:5000/check-skills/${supabaseId}`
      );

      const result = await response.json();

      if (result.hasSkills) {
        // Old user → skip skill page
        window.location.href = "/dashboard";
      } else {
        // New user → go to skill page
        window.location.href = "/skills";
      }
    } catch (err) {
      console.error("Error checking skills:", err);
      setErrorMessage("Error checking user skills");
    }
  };

  return (
    <div className="auth-page small">
      <div className="auth-container small">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        {/*  Error Message */}
        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {errorMessage}
          </p>
        )}

        <Link
          to="/register"
          className="switch-link"
          style={{ display: "block", marginTop: "15px", textAlign: "center" }}
        >
          Don’t have an account? Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
