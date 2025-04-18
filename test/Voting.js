const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Voting", function () {
  let voting;
  let owner;
  let voter1;
  let voter2;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
  });

  describe("Event Creation", function () {
    it("Should allow owner to create an event", async function () {
      const title = "Test Election";
      const candidates = ["Candidate A", "Candidate B"];
      const duration = 60; // 60 minutes

      await expect(voting.createEvent(title, candidates, duration))
        .to.emit(voting, "EventCreated")
        .withArgs(1, title);
    });

    it("Should not allow non-owner to create an event", async function () {
      await expect(
        voting.connect(voter1).createEvent("Test", ["A", "B"], 60)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await voting.createEvent("Test Election", ["A", "B"], 60);
    });

    it("Should allow a voter to cast a vote", async function () {
      await expect(voting.connect(voter1).vote(1, 0))
        .to.emit(voting, "VoteCast")
        .withArgs(1, voter1.address, 0);
    });

    it("Should not allow double voting", async function () {
      await voting.connect(voter1).vote(1, 0);
      await expect(voting.connect(voter1).vote(1, 0)).to.be.revertedWith(
        "Already voted in this event"
      );
    });
  });
});
