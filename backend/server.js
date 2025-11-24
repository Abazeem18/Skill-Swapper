import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import User from "./models/user.js";
import SwapRequest from "./models/SwapRequest.js";
import Chat from "./models/Chat.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// ================= USER & SKILLS =================

// ✅ Save / Update Skills
app.post("/save-skills", async (req, res) => {
  const { supabaseId, email, skillsOffered, skillsWanted } = req.body;

  try {
    let user = await User.findOne({ supabaseId });

    if (!user) {
      user = new User({
        supabaseId,
        email,
        skillsOffered,
        skillsWanted
      });
    } else {
      user.skillsOffered = skillsOffered;
      user.skillsWanted = skillsWanted;
    }

    await user.save();

    res.status(200).json({ message: "✅ Skills saved successfully!" });
  } catch (error) {
    console.error("Error saving skills:", error);
    res.status(500).json({
      message: "❌ Error saving skills",
      error: error.message
    });
  }
});

// ✅ Check if user already has skills
app.get("/check-skills/:supabaseId", async (req, res) => {
  try {
    const user = await User.findOne({ supabaseId: req.params.supabaseId });

    if (!user) return res.json({ hasSkills: false });

    const hasSkills =
      user.skillsOffered.length > 0 ||
      user.skillsWanted.length > 0;

    res.json({ hasSkills });
  } catch (error) {
    res.status(500).json({ message: "Error checking skills" });
  }
});

// ✅ Search users by skill
app.get("/search-users/:skill", async (req, res) => {
  try {
    const users = await User.find({
      $or: [
        { skillsOffered: { $regex: req.params.skill, $options: "i" } },
        { skillsWanted: { $regex: req.params.skill, $options: "i" } }
      ]
    });

    res.json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

// ================= SWAP REQUEST =================

// ✅ Send swap request
app.post("/send-request", async (req, res) => {
  const { fromUser, toUser, offeredSkill, requestedSkill } = req.body;

  try {
    const newRequest = new SwapRequest({
      fromUser,
      toUser,
      offeredSkill,
      requestedSkill,
      status: "pending"
    });

    await newRequest.save();

    res.json({ message: "✅ Swap request sent successfully!" });
  } catch (error) {
    console.error("Request error:", error);
    res.status(500).json({ message: "❌ Failed to send request" });
  }
});

// ✅ UPDATED: Get requests for BOTH sender and receiver
app.get("/requests/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const requests = await SwapRequest.find({
      $or: [
        { toUser: userId },
        { fromUser: userId }
      ]
    });

    res.json(requests);
  } catch (error) {
    console.error("Fetch requests error:", error);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

// ✅ Accept request
app.put("/accept-request/:id", async (req, res) => {
  try {
    await SwapRequest.findByIdAndUpdate(req.params.id, {
      status: "accepted"
    });

    res.json({ message: "✅ Request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to accept request" });
  }
});

// ✅ Reject request
app.put("/reject-request/:id", async (req, res) => {
  try {
    await SwapRequest.findByIdAndUpdate(req.params.id, {
      status: "rejected"
    });

    res.json({ message: "❌ Request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject request" });
  }
});

// ================= CHAT =================

// ✅ Send chat message
app.post("/send-message", async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const newMessage = new Chat({
      senderId,
      receiverId,
      message
    });

    await newMessage.save();

    res.json({ message: "✅ Message sent successfully" });
  } catch (error) {
    console.error("Chat send error:", error);
    res.status(500).json({ message: "❌ Failed to send message" });
  }
});

// ✅ Get chat messages between two users
app.get("/messages/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Chat.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ message: "❌ Failed to fetch messages" });
  }
});

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
