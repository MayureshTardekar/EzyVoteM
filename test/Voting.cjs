const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Voting Contract", function () {
  let voting;
  let owner;
  let voter1;
  let voter2;
  let eventId;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();

    // Create a test event
    await voting.createEvent(
      "Test Election",
      ["Candidate A", "Candidate B"],
      60 // 60 minutes duration
    );
    eventId = 1;
  });

  describe("Voting Functionality", function () {
    it("Should allow eligible voter to cast vote", async function () {
      await expect(voting.connect(voter1).vote(eventId, 0))
        .to.emit(voting, "VoteCast")
        .withArgs(eventId, voter1.address, 0);
    });

    it("Should prevent double voting", async function () {
      await voting.connect(voter1).vote(eventId, 0);
      await expect(voting.connect(voter1).vote(eventId, 0)).to.be.revertedWith(
        "Already voted in this event"
      );
    });

    it("Should prevent voting after event ends", async function () {
      await time.increase(3601); // Advance time by more than 60 minutes
      await expect(voting.connect(voter1).vote(eventId, 0)).to.be.revertedWith(
        "Voting has ended"
      );
    });

    it("Should prevent voting for invalid candidate", async function () {
      await expect(voting.connect(voter1).vote(eventId, 99)).to.be.revertedWith(
        "Invalid candidate"
      );
    });
  });

  describe("Event Results", function () {
    it("Should correctly count votes", async function () {
      await voting.connect(voter1).vote(eventId, 0);
      await voting.connect(voter2).vote(eventId, 0);

      const event = await voting.getEvent(eventId);
      expect(event.candidates[0].voteCount).to.equal(2);
    });
  });
});
