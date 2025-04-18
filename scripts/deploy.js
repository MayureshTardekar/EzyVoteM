import dotenv from "dotenv";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
  try {
    // Deploy the contract
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    const address = await voting.getAddress();
    console.log("Voting contract deployed to:", address);

    // Create a test event to verify it works
    const tx = await voting.createEvent(
      "Test Election",
      ["Candidate A", "Candidate B"],
      60 // 60 minutes duration
    );
    await tx.wait();
    console.log("Test event created successfully");
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
