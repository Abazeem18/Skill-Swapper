import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../Auth.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      const loggedInUser = data.session.user;
      setUser(loggedInUser);
      fetchRequests(loggedInUser.id);
    } else {
      navigate("/login");
    }
  };

  //  Fetch BOTH sent and received requests
  const fetchRequests = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/requests/${userId}`
      );

      const data = await res.json();

      //  Only accepted requests shown
      const acceptedRequests = data.filter(
        (req) => req.status === "accepted"
      );

      setRequests(acceptedRequests);
    } catch (error) {
      console.error("Error loading requests:", error);
    }
  };

  return (
    <>
      <Navbar user={user} />

      <div className="auth-page wide">
        <div className="auth-container wide">


          <h2>Dashboard</h2>

          {user && (
            <p><b>Logged in as:</b> {user.email}</p>
          )}

          <hr />

          <h3>Your Chat Connections</h3>

          {requests.length === 0 && (
            <p>No accepted requests yet.</p>
          )}

          {requests.map((req) => {
            //  Find the other user
            const otherUserId =
              req.fromUser === user.id ? req.toUser : req.fromUser;

            return (
              <div key={req._id} className="card">
                <p><b>Connected User ID:</b> {otherUserId}</p>
                <p><b>Skill Swap:</b> {req.offeredSkill} ↔ {req.requestedSkill}</p>
                <p><b>Status:</b> {req.status}</p>

                <button
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#007bff",
                    color: "white"
                  }}
                  onClick={() => navigate(`/chat/${otherUserId}`)}
                >
                  Open Chat
                </button>
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
}

export default Dashboard;
