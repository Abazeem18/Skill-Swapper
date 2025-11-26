import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadUserAndRequests();
  }, []);

  const loadUserAndRequests = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      alert("Please login");
      navigate("/login");
      return;
    }

    const currentUser = data.session.user;
    setUser(currentUser);

    const res = await fetch(
      `http://localhost:5000/requests/${currentUser.id}`
    );

    const requestsData = await res.json();
    setRequests(requestsData);
  };

  //  Accept request
  const acceptRequest = async (id) => {
    const res = await fetch(
      `http://localhost:5000/accept-request/${id}`,
      { method: "PUT" }
    );

    const data = await res.json();
    alert(data.message);

    loadUserAndRequests();
  };

  //  Reject request
  const rejectRequest = async (id) => {
    const res = await fetch(
      `http://localhost:5000/reject-request/${id}`,
      { method: "PUT" }
    );

    const data = await res.json();
    alert(data.message);

    loadUserAndRequests();
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

        <h2>My Swap Requests</h2>

        {requests.length === 0 && <p>No requests found.</p>}

        {requests.map((req) => (
          <div key={req._id} className="card">

            <p><b>From:</b> {req.fromUser}</p>
            <p><b>To:</b> {req.toUser}</p>
            <p><b>They want:</b> {req.requestedSkill}</p>
            <p><b>They offer:</b> {req.offeredSkill}</p>
            <p><b>Status:</b> {req.status}</p>

            {/*  Accept / Reject only visible to receiver */}
            {user?.id === req.toUser && req.status === "pending" && (
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => acceptRequest(req._id)}
                  style={{ background: "green", color: "white" }}
                >
                  Accept
                </button>

                <button
                  onClick={() => rejectRequest(req._id)}
                  style={{ background: "red", color: "white" }}
                >
                  Reject
                </button>
              </div>
            )}

            {/*  Chat button only after accepted */}
            {req.status === "accepted" && (
              <button
                onClick={() =>
                  navigate(`/chat/${req.fromUser}`)
                }
                style={{
                  marginTop: "10px",
                  backgroundColor: "#007bff",
                  color: "white"
                }}
              >
                Open Chat
              </button>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default Requests;
