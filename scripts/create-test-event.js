const hre = require("hardhat");

async function main() {
  try {
    // Get contract instance
    const Voting = await hre.ethers.getContractFactory("Voting");
    const contract = await Voting.attach(
      "0x2e9949111Ab31E38B22C0c8Af524ae60A08BC943"
    );

    // Create a test event
    console.log("Creating test event...");
    const tx = await contract.createEvent(
      "2024 Student Election",
      ["John Smith", "Jane Doe", "Bob Wilson"],
      120 // 2 hours duration
    );
    
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Event created successfully!");

    // Verify event creation
    const eventCount = await contract.eventCount();
    console.log("Total events:", eventCount.toString());
    
    const event = await contract.getEvent(1);
    console.log("Event details:", {
      title: event.title,
      candidates: event.candidates.map(c => ({
        name: c.name,
        votes: c.voteCount.toString()
      })),
      endTime: new Date(Number(event.endTime) * 1000).toLocaleString(),
      active: event.active
    });

  } catch (error) {
    console.error("Error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });