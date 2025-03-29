// In-memory arrays to store admin wallet addresses
let admins = [];

// Wallet Login for both admin and user
exports.walletLogin = async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address is required" });
  }
  try {
    // Normalize wallet address
    const normalizedWallet = walletAddress.toLowerCase();

    // Check if the wallet is an admin
    const isAdmin = admins.find(
      (admin) => admin.walletAddress === normalizedWallet
    );
    if (isAdmin) {
      return res.status(200).json({ redirectTo: "admin-dashboard" }); // Admin dashboard
    }

    // If not an admin, treat as a regular user
    return res.status(200).json({ redirectTo: "user-dashboard" }); // User dashboard
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new admin
exports.addAdmin = async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address is required" });
  }
  try {
    // Normalize wallet address
    const normalizedWallet = walletAddress.toLowerCase();

    // Check if wallet address already exists as an admin
    const existingAdmin = admins.find(
      (admin) => admin.walletAddress === normalizedWallet
    );
    if (existingAdmin) {
      return res.status(400).json({ message: "Wallet is already an admin" });
    }

    // Add new admin
    admins.push({ walletAddress: normalizedWallet });
    return res.status(201).json({ message: "Admin added successfully" });
  } catch (error) {
    console.error("Error adding admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all admins
exports.getAdmins = async (req, res) => {
  try {
    // Return the list of admin wallet addresses
    return res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
