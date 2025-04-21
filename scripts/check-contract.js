const hre = require("hardhat");

async function main() {
  try {
    // Get signer
    const [signer] = await hre.ethers.getSigners();
    console.log("Connected with address:", signer.address);

    // Get contract factory
    const Voting = await hre.ethers.getContractFactory("Voting");

    // Use the correct contract address from your deployment
    const contractAddress =
      "0x0c0b88ff6cbe2d49279cdfc4500e682f8989c1d92d729b6e669c9c6313c02011";

    // Create contract instance
    const contract = await Voting.attach(contractAddress);
    console.log("Contract address:", await contract.getAddress());

    // Basic contract interaction
    const eventCount = await contract.eventCount();
    console.log("Total events:", eventCount.toString());

    // If events exist, get details of the first one
    if (eventCount > 0) {
      const event = await contract.getEvent(1);
      console.log("\nFirst event details:");
      console.log("Title:", event.title);
      console.log("Active:", event.active);
      console.log(
        "End time:",
        new Date(Number(event.endTime) * 1000).toLocaleString()
      );
      console.log("\nCandidates:");
      event.candidates.forEach((candidate, index) => {
        console.log(
          `${index + 1}. ${candidate.name}: ${candidate.voteCount} votes`
        );
      });
    }
  } catch (error) {
    console.error("\nError details:");
    console.error(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
