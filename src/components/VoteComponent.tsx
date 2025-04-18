import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import { VOTING_CONTRACT_ABI } from "../constants/abi";
import { VOTING_CONTRACT_ADDRESS } from "../constants/contracts";

export function VoteComponent({
  eventId,
  candidateIndex,
}: {
  eventId: number;
  candidateIndex: number;
}) {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask to vote");
      return;
    }

    try {
      setIsVoting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS,
        VOTING_CONTRACT_ABI,
        signer
      );

      const tx = await contract.vote(eventId, candidateIndex);

      toast.info("Confirming your vote...");
      await tx.wait();

      toast.success("Vote cast successfully!");
    } catch (error: any) {
      console.error("Voting error:", error);
      toast.error(error.message || "Failed to cast vote");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={isVoting}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {isVoting ? "Voting..." : "Cast Vote"}
    </button>
  );
}
