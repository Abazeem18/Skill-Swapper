import { useState } from "react";
import { supabase } from "../supabaseClient";
import {Link} from 'react-router-dom'
import "../Auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setMessage(" Registration successful! Redirecting to login...");

      setEmail("");
      setPassword("");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  return (
    <div className="auth-page small">
      <div className="auth-container small">

        <h2>Register</h2>

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

        <button onClick={handleRegister}>Register</button>

        <Link
          to="/login"
          className="switch-link"
          style={{ display: "block", marginTop: "15px", textAlign: "center" }}
        >
          Already have an account? Login
        </Link>
        {/*  Success message */}
        {message && (
          <p style={{ color: "green", marginTop: "10px" }}>
            {message}
          </p>
        )}

        {/*  Error message */}
        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {errorMessage}
          </p>
        )}

      </div>
    </div>
  );
}

export default Register;
