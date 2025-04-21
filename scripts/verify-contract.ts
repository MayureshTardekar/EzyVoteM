import { ethers } from "hardhat";

async function main() {
  // Update this to your newly deployed contract address
  const CONTRACT_ADDRESS = "0x99a4cfb2efd0d5d3954b3f4c60ae657e5c10c161";
  
  console.log("\n📍 Contract Address:", CONTRACT_ADDRESS);
  console.log("🔍 Starting contract verification...");

  try {
    // Get contract instance
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach(CONTRACT_ADDRESS);
    
    // Verify the contract address after attachment
    const deployedAddress = await voting.getAddress();
    console.log("📋 Verified Contract Address:", deployedAddress);

    // Get event count
    const eventCount = await voting.eventCount();
    console.log("\n✅ Contract is responsive!");
    console.log("Current event count:", eventCount.toString());

    // Create a test event
    console.log("\n📝 Creating test event...");
    const tx = await voting.createEvent(
      "Test Election 2024",
      ["Candidate A", "Candidate B"],
      60 // 60 minutes duration
    );

    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");
    await tx.wait();

    // Verify event was created
    const newEventCount = await voting.eventCount();
    console.log("\n✨ Success! New event count:", newEventCount.toString());

    // Get event details
    const event = await voting.getEvent(newEventCount);
    console.log("\n📊 Event Details:");
    console.log("Title:", event.title);
    console.log("Active:", event.active);
    console.log("End Time:", new Date(Number(event.endTime) * 1000).toLocaleString());
    console.log("\nCandidates:");
    event.candidates.forEach((candidate: any, index: number) => {
      console.log(`${index + 1}. ${candidate.name}: ${candidate.voteCount.toString()} votes`);
    });

  } catch (error) {
    console.error("\n❌ Error:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



