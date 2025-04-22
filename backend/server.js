const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const ethers = require("ethers");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

// Admin wallets
let adminWallets = [];
const loadAdminWallets = () => {
  const configPath = path.join(__dirname, "config", "adminWallets.json");
  try {
    const configData = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(configData);
    adminWallets = config.adminWallets.map((addr) => addr.toLowerCase());
    console.log("✅ Admin wallets loaded successfully.");
  } catch (error) {
    console.error("❌ Error reading adminWallets.json:", error.message);
    process.exit(1);
  }
};
loadAdminWallets();

let reloadTimeout;
fs.watch(path.join(__dirname, "config", "adminWallets.json"), () => {
  clearTimeout(reloadTimeout);
  reloadTimeout = setTimeout(() => {
    console.log("🔄 Admin wallet list updated. Reloading...");
    loadAdminWallets();
  }, 100);
});

// HTTP and WebSocket servers
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const activeConnections = new Set();
wss.on("connection", (ws) => {
  console.log("🔗 New WebSocket connection established");
  activeConnections.add(ws);

  ws.on("message", (message) => {
    console.log(`📩 Received message: ${message}`);
  });

  ws.on("close", () => {
    console.log("🔌 WebSocket connection closed");
    activeConnections.delete(ws);
  });
});

wss.on("error", (error) => {
  console.error("🚨 WebSocket server error:", error.message);
});

// Simplified broadcast function
function broadcast(data) {
  activeConnections.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(data));
      } catch (error) {
        console.error("Broadcast error:", error);
      }
    }
  });
}

// In-memory storage for events and votes
let events = [];
let votes = [];

// Record a vote
app.post("/api/vote", async (req, res) => {
  const { eventId, candidateIndex, signature, walletAddress } = req.body;

  // Find the event
  const event = events.find((e) => e.id === parseInt(eventId));
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Check whitelist for secure events - make sure addresses are normalized
  if (event.isSecure) {
    const normalizedAddress = walletAddress.toLowerCase();
    const normalizedWhitelist = event.voterAddresses.map((addr) =>
      addr.toLowerCase()
    );

    if (!normalizedWhitelist.includes(normalizedAddress)) {
      return res.status(403).json({
        message: "Address not whitelisted for this secure event",
      });
    }
  }

  // Validate input data
  if (
    !eventId ||
    candidateIndex === undefined ||
    !signature ||
    !walletAddress
  ) {
    console.error("❌ Invalid input data:", req.body);
    return res.status(400).json({ message: "Invalid input data" });
  }

  // Verify signature
  const message = "Please sign this message to confirm your vote";
  try {
    const signerAddress = ethers.verifyMessage(message, signature);
    if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      console.error("❌ Invalid signature for wallet:", walletAddress);
      return res.status(401).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.error("❌ Error verifying signature:", error.message);
    return res.status(400).json({ message: "Invalid signature format" });
  }

  // Validate candidate index
  if (candidateIndex < 0 || candidateIndex >= event.candidates.length) {
    console.error("❌ Invalid candidate index:", candidateIndex);
    return res.status(400).json({ message: "Invalid candidate index" });
  }

  // Check if the user has already voted in this event
  const hasVoted = votes.some(
    (vote) => vote.eventId === eventId && vote.walletAddress === walletAddress
  );
  if (hasVoted) {
    console.error("❌ User has already voted in this event:", walletAddress);
    return res
      .status(400)
      .json({ message: "You have already voted in this event" });
  }

  // Record the vote
  votes.push({ eventId, candidateIndex, signature, walletAddress });
  event.candidates[candidateIndex].votes += 1;

  // Broadcast the updated vote count
  broadcast({
    type: "voteUpdate",
    data: {
      eventId,
      candidateIndex,
      updatedVoteCount: event.candidates[candidateIndex].votes,
    },
  });

  console.log("✅ Vote recorded successfully for wallet:", walletAddress);
  res.status(200).json({ message: "Vote recorded successfully" });
});

// Fetch event by ID
app.get("/api/events/:id", async (req, res) => {
  const eventId = parseInt(req.params.id);
  try {
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      console.error("❌ Event not found for ID:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("✅ Event fetched successfully:", event.title);
    res.json(event);
  } catch (error) {
    console.error("❌ Error fetching event:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new event
app.post("/api/events", async (req, res) => {
  try {
    console.log("Received event creation request:", req.body);
    
    const {
      title,
      candidates,
      manifesto,
      voterLimit,
      startDate,
      startTime,
      endDate,
      endTime,
      isSecure,
      voterAddresses
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    
    if (!candidates || candidates.length < 2) {
      return res.status(400).json({ message: "At least two candidates are required" });
    }

    if (isSecure && (!voterAddresses || voterAddresses.length === 0)) {
      return res.status(400).json({ message: "Secure events require at least one whitelisted address" });
    }

    const newEvent = {
      id: Date.now(),
      title,
      candidates: candidates.map(candidate => ({
        name: candidate.name,
        bio: candidate.bio || "",
        votes: 0,
      })),
      manifesto: manifesto || "",
      voterLimit: parseInt(voterLimit, 10) || 0,
      startDate,
      startTime,
      endDate,
      endTime,
      isSecure,
      voterAddresses: isSecure ? voterAddresses.map(addr => addr.toLowerCase()) : [],
      active: true,
      createdAt: new Date().toISOString()
    };

    // Add to events array
    events.push(newEvent);

    // Broadcast to WebSocket clients
    broadcast({
      type: "newEvent",
      data: newEvent,
    });

    console.log("Event created successfully:", newEvent);
    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Server error creating event:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
});

// Wallet login
app.post("/api/wallet-login", async (req, res) => {
  const { walletAddress, signature } = req.body;

  if (!walletAddress || !signature) {
    console.warn("⚠️ Wallet login request missing required fields.");
    return res
      .status(400)
      .json({ message: "Wallet address and signature are required" });
  }

  try {
    const normalizedWallet = walletAddress.toLowerCase();
    const message = "Please sign this message to verify your identity.";

    try {
      const signerAddress = ethers.verifyMessage(message, signature);
      if (signerAddress.toLowerCase() !== normalizedWallet) {
        console.error("❌ Invalid signature for wallet:", walletAddress);
        return res.status(401).json({ message: "Invalid signature" });
      }
    } catch (error) {
      console.error("❌ Error verifying signature:", error.message);
      return res.status(400).json({ message: "Invalid signature format" });
    }

    const isAdmin = adminWallets.includes(normalizedWallet);
    console.log(
      `✅ Wallet logged in: ${walletAddress} (${isAdmin ? "Admin" : "User"})`
    );

    return res.status(200).json({
      message: `✅ Wallet connected! Role: ${isAdmin ? "Admin" : "User"}`,
      redirectTo: isAdmin ? "AdminDashboard" : "user-dashboard",
      role: isAdmin ? "admin" : "user",
    });
  } catch (error) {
    console.error("❌ Error processing wallet login:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Wallet disconnect
app.post("/api/wallet-disconnect", async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    console.warn("⚠️ Disconnect request received without a wallet address.");
    return res.status(400).json({ message: "Wallet address is required" });
  }

  try {
    const normalizedWallet = walletAddress.toLowerCase();
    console.log(`🔌 Wallet disconnected: ${walletAddress}`);

    return res
      .status(200)
      .json({ message: "✅ Wallet disconnected successfully" });
  } catch (error) {
    console.error("❌ Error processing wallet disconnection:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Helper functions
function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isValidTime(time) {
  return /^\d{2}:\d{2}$/.test(time);
}

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down server...");
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });

  wss.clients.forEach((client) => {
    client.terminate();
  });
});

process.on("SIGTERM", () => {
  console.log("🛑 Terminating server...");
  server.close(() => {
    console.log("✅ Server terminated.");
    process.exit(0);
  });

  wss.clients.forEach((client) => {
    client.terminate();
  });
});
