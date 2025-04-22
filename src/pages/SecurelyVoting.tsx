/** @jsxImportSource react */
import { ethers } from "ethers"; // Import ethers for interacting with Ethereum
import { Clock } from "lucide-react"; // Import Clock icon from lucide-react
import { useEffect, useState } from "react"; // Import React for JSX syntax
import { toast } from "react-toastify"; // Import toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications

// Import custom components
import Button from "../components/Button"; // Import Button component
import Card from "../components/Card"; // Import Card component

interface Event {
  id: number;
  title: string;
  endDate: string;
  candidates: {
    name: string;
    voteCount: number;
  }[];
}

const VOTING_CONTRACT_ADDRESS = "0x4Fa7480F0eF75244b199117eD3B6eA06C71F79e5"; // Updated for your contract address
const VotingABI = [
  "function getEvent(uint256 _eventId) public view returns (tuple(string title, uint256 endTime, bool active, bool isSecure, tuple(string name, uint256 voteCount)[] candidates))",
  "function isWhitelisted(uint256 _eventId, address _voter) public view returns (bool)",
  "function hasVoted(address _voter, uint256 _eventId) public view returns (bool)",
  "function vote(uint256 _eventId, uint256 _candidateIndex) public",
];

const SecurelyVoting = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedEventIds, setVotedEventIds] = useState<number[]>([]);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState<string[]>(
    []
  ); // Add this line
  const [selectedCandidate, setSelectedCandidate] = useState<number>(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/secure-events");
        const data = await response.json();
        if (response.ok) {
          setEvents(data.events);
          setWhitelistedAddresses(data.whitelist);
        } else {
          toast.error("Failed to fetch secure events");
        }
      } catch (error) {
        console.error("Error fetching secure events:", error);
        toast.error("An error occurred while fetching secure events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleVote = async (eventId: number) => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask to vote");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // First check if the address is whitelisted
      const normalizedAddress = address.toLowerCase();
      if (!whitelistedAddresses.includes(normalizedAddress)) {
        toast.error("Your address is not whitelisted for this event");
        return;
      }

      const contract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS,
        VotingABI,
        signer
      );

      try {
        // Check if event exists and is active
        const eventData = await contract.getEvent(eventId);
        if (!eventData.active) {
          toast.error("This event is not active");
          return;
        }

        // Double check whitelist on contract level
        const isWhitelisted = await contract.isWhitelisted(eventId, address);
        if (!isWhitelisted) {
          toast.error("Your address is not whitelisted for this event");
          return;
        }

        // Check if already voted
        const hasVoted = await contract.hasVoted(address, eventId);
        if (hasVoted) {
          toast.error("You have already voted in this event");
          return;
        }

        // Cast vote
        const tx = await contract.vote(eventId, selectedCandidate);
        toast.info("Processing vote... Please wait for confirmation");

        // Wait for transaction confirmation
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          toast.success("Vote recorded successfully!");
          setVotedEventIds((prev) => [...prev, eventId]);
        } else {
          toast.error("Transaction failed");
        }
      } catch (contractError: any) {
        console.error("Contract interaction error:", contractError);
        toast.error(
          contractError.message || "Failed to interact with the contract"
        );
        return;
      }
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast.error(error.message || "Failed to connect wallet");
    }
  };

  // Add candidate selection UI
  const renderCandidates = (event: Event): JSX.Element => {
    if (!event.candidates || event.candidates.length === 0) {
      return <p className="text-gray-600">No candidates available</p>;
    }

    return (
      <div className="mb-4">
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => setSelectedCandidate(Number(e.target.value))}
          value={selectedCandidate}
        >
          {event.candidates.map((candidate, index) => (
            <option key={index} value={index}>
              {candidate.name} ({candidate.voteCount} votes)
            </option>
          ))}
        </select>
      </div>
    );
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-700">Securely Voting</h1>
        <p className="mt-2 text-gray-600">
          Participate in secure elections with whitelisted addresses.
        </p>
      </header>

      <Card className="mx-auto max-w-4xl p-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {event.title}
                </h2>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(event.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {renderCandidates(event)}

              <Button
                onClick={() => handleVote(event.id)}
                variant="primary"
                className="w-full mt-4"
                disabled={votedEventIds.includes(event.id)}
              >
                {votedEventIds.includes(event.id) ? "Voted" : "Vote Securely"}
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No secure elections available at the moment.
          </p>
        )}
      </Card>
    </div>
  );
};

export default SecurelyVoting;
