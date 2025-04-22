const hre = require("hardhat");

async function main() {
  try {
    // Deploy the contract
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    const address = await voting.getAddress();
    console.log("Voting contract deployed to:", address);

    // Create a test event with the correct parameters
    const tx = await voting.createEvent(
      "Test Election",                    // title
      ["Candidate A", "Candidate B"],     // candidate names
      60,                                 // duration in minutes
      false,                              // isSecure
      []                                  // whitelistedVoters (empty array for non-secure election)
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
