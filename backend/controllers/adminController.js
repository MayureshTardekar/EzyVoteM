// In-memory array to store admin wallet addresses
let adminWallets = [];

// Add a new admin
exports.addAdmin = async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address is required" });
  }
  try {
    // Normalize wallet address
    const normalizedWallet = walletAddress.toLowerCase();

    // Check if wallet address already exists
    const existingAdmin = adminWallets.find(
      (admin) => admin.walletAddress === normalizedWallet
    );
    if (existingAdmin) {
      return res.status(400).json({ message: "Wallet is already an admin" });
    }

    // Add new admin to the in-memory array
    adminWallets.push({ walletAddress: normalizedWallet });
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
    return res.status(200).json(adminWallets);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
