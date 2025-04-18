const hre = require("hardhat");

async function main() {
  try {
    // Get contract instance
    const Voting = await hre.ethers.getContractFactory("Voting");
    const contract = await Voting.attach(
      "0x2e9949111Ab31E38B22C0c8Af524ae60A08BC943"
    );

    const signer = new hre.ethers.Wallet(
      process.env.PRIVATE_KEY,
      hre.ethers.provider
    );
    console.log("Connected with address:", signer.address);

    const EVENT_ID = 3;
    const CANDIDATE_INDEX = 0;

    // Check event details before voting
    console.log(`\nChecking event ${EVENT_ID} status...`);
    const eventData = await contract.getEvent(EVENT_ID);
    console.log("Event Title:", eventData.title);
    console.log("Active:", eventData.active);
    console.log(
      "End time:",
      new Date(Number(eventData.endTime) * 1000).toLocaleString()
    );
    console.log("\nCandidates:");
    eventData.candidates.forEach((candidate, index) => {
      console.log(
        `${index}: ${candidate.name} (${candidate.voteCount.toString()} votes)`
      );
    });

    // Check if already voted
    const hasVoted = await contract.hasVoted(signer.address, EVENT_ID);
    console.log("\nHas already voted:", hasVoted);

    if (hasVoted) {
      console.log("Cannot vote: Already voted in this event");
      return;
    }

    if (!eventData.active) {
      console.log("Cannot vote: Event is not active");
      return;
    }

    if (Date.now() / 1000 > Number(eventData.endTime)) {
      console.log("Cannot vote: Event has ended");
      return;
    }

    // If all checks pass, cast the vote
    console.log(
      `\nCasting vote for event ${EVENT_ID}, candidate index ${CANDIDATE_INDEX}...`
    );
    const tx = await contract.connect(signer).vote(EVENT_ID, CANDIDATE_INDEX);
    console.log("Vote transaction hash:", tx.hash);

    await tx.wait();
    console.log("Vote cast successfully!");

    // Verify the updated vote count
    const updatedEventData = await contract.getEvent(EVENT_ID);
    console.log("\nUpdated vote counts:");
    updatedEventData.candidates.forEach((candidate, index) => {
      console.log(`${candidate.name}: ${candidate.voteCount.toString()} votes`);
    });
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
