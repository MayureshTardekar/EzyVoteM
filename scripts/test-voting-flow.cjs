const hre = require("hardhat");

async function main() {
  try {
    // Get contract instance
    const Voting = await hre.ethers.getContractFactory("Voting");
    const contract = await Voting.attach(
      "0xb54876bd974FA8c2822Ad1D13AF5089C67A604df"
    );

    // Check network connection
    const provider = await hre.ethers.provider;
    const network = await provider.getNetwork();
    console.log("Connected to network:", {
      name: network.name,
      chainId: Number(network.chainId),
    });

    // Get event count
    const eventCount = await contract.eventCount();
    console.log("Total events:", Number(eventCount));

    // Get event details
    if (Number(eventCount) >= 1) {
      for (let i = 1; i <= Number(eventCount); i++) {
        const event = await contract.events(i);
        console.log(`Event ${i}:`, {
          title: event.title,
          endTime: new Date(Number(event.endTime) * 1000).toLocaleString(),
          active: event.active,
        });
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
