const hre = require("hardhat");

async function main() {
  const [owner, voter1] = await hre.ethers.getSigners();

  // Get the deployed contract instance
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.attach("YOUR_DEPLOYED_CONTRACT_ADDRESS"); // Replace with actual address

  // Create a test event
  const tx = await voting.createEvent(
    "Test Election",
    ["Candidate A", "Candidate B"],
    60
  );
  await tx.wait();
  console.log("Test event created");

  // Cast vote using voter1
  const voteTransaction = await voting.connect(voter1).vote(1, 0);
  await voteTransaction.wait();
  console.log("Vote cast by:", voter1.address);

  // Verify vote
  const event = await voting.getEvent(1);
  console.log(
    "Vote count for Candidate A:",
    event.candidates[0].voteCount.toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
