import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { VOTING_CONTRACT_ABI } from "../constants/abi"; // Updated import
import { VOTING_CONTRACT_ADDRESS } from "../constants/contracts";

export default function TestVoting() {
  const [networkStatus, setNetworkStatus] = useState<string>(
    "Checking network..."
  );
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkNetwork();
  }, []);

  const checkNetwork = async () => {
    try {
      if (!window.ethereum) {
        setNetworkStatus("MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();

      // Updated contract instance creation using VOTING_CONTRACT_ABI
      const votingContract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS,
        VOTING_CONTRACT_ABI,
        signer
      );
      setContract(votingContract);

      // Get event count to verify contract connection
      const eventCount = await votingContract.eventCount();
      setNetworkStatus(
        `Connected to network: ${network.name}, Chain ID: ${network.chainId}, Events: ${eventCount}`
      );

      // Fetch events
      const events = [];
      for (let i = 1; i <= eventCount; i++) {
        const event = await votingContract.getEvent(i);
        events.push({
          id: i,
          title: event.title,
          candidates: event.candidates,
        });
      }
      setEvents(events);
    } catch (error) {
      console.error("Network check error:", error);
      setNetworkStatus("Failed to connect to network");
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (eventId: number, candidateIndex: number) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.vote(eventId, candidateIndex);
      console.log("Vote transaction sent:", tx.hash);

      await tx.wait();
      console.log("Vote confirmed!");
      alert("Vote cast successfully!");
    } catch (error: any) {
      console.error("Voting error:", error);
      alert(error.message || "Failed to cast vote");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 p-2 bg-gray-100 rounded">
        <h2>Network Status:</h2>
        <p>{networkStatus}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Available Events:</h2>
        {events.map((event) => (
          <div key={event.id} className="border p-4 my-2 rounded">
            <h3>
              Event {event.id}: {event.title}
            </h3>
            <div className="mt-2">
              {event.candidates.map((candidate: any, index: number) => (
                <button
                  key={index}
                  onClick={() => castVote(event.id, index)}
                  disabled={loading}
                  className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  Vote for {candidate.name} (Votes:{" "}
                  {candidate.voteCount.toString()})
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
