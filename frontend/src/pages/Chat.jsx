import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";

function Chat() {
  const { otherUserId } = useParams();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  //  Load user on page load
  useEffect(() => {
    loadUser();
  }, []);

  //  Auto refresh messages every 1 second
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      loadMessages(user.id);
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const loadUser = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      const loggedUser = data.session.user;
      setUser(loggedUser);
      loadMessages(loggedUser.id);
    }
  };

  const loadMessages = async (myId) => {
    const res = await fetch(
      `http://localhost:5000/messages/${myId}/${otherUserId}`
    );

    const data = await res.json();
    setMessages(data);
  };

  //  Fast sending with Optimistic UI
  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    const newMsg = {
      senderId: user.id,
      receiverId: otherUserId,
      message: message,
      createdAt: new Date()
    };

    //  Show instantly before server response
    setMessages((prev) => [...prev, newMsg]);

    const tempMessage = message;
    setMessage("");

    await fetch("http://localhost:5000/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg)
    });
  };

  return (
    <>
      <Navbar user={user} />

      <div
        style={{
          maxWidth: "800px",
          height: "80vh",
          margin: "20px auto",
          border: "1px solid #ddd",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          background: "#fff"
        }}
      >
        <h3 style={{ padding: "10px", textAlign: "center" }}>
          Chat Window
        </h3>

        {/*  Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px",
            background: "#f9f9f9"
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.senderId === user?.id ? "right" : "left",
                marginBottom: "8px"
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  background:
                    msg.senderId === user?.id ? "#007bff" : "#e4e6eb",
                  color: msg.senderId === user?.id ? "white" : "black",
                  maxWidth: "70%",
                  wordBreak: "break-word"
                }}
              >
                {msg.message}
              </span>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div
          style={{
            display: "flex",
            padding: "10px",
            borderTop: "1px solid #ccc"
          }}
        >
          <input
            type="text"
            value={message}
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginRight: "5px"
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "8px 15px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;
