import { ethers } from "ethers";
import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import Card from "../components/Card";
import { useWallet } from "../components/WalletContext";

const VoteNow = () => {
  const { eventId } = useParams(); // Get the eventId from the URL
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  const [timeRemaining, setTimeRemaining] = useState("");
  const { walletAddress, isWalletConnected, connectWallet } = useWallet();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Fetch event data from the backend
        const response = await fetch(
          `http://localhost:5000/api/events/${eventId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error(
          "Failed to fetch event. Please check your connection or try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      wsRef.current = new WebSocket("ws://localhost:5000");

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "voteUpdate") {
            setEvent((prevEvent) => {
              if (!prevEvent) return prevEvent;
              const updatedCandidates = [...prevEvent.candidates];
              updatedCandidates[data.data.candidateIndex].votes =
                data.data.updatedVoteCount;
              return { ...prevEvent, candidates: updatedCandidates };
            });
          }
        } catch (error) {
          console.error("WebSocket message error:", error);
        }
      };

      wsRef.current.onclose = () => {
        // Silent reconnect without notifying user
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2000);
      };
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, [eventId]);

  const handleVote = async () => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet to vote.");
      return;
    }

    if (selectedCandidate === null) {
      toast.error("Please select a candidate before submitting your vote.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Step 1: Request MetaMask transaction confirmation
      const tx = await signer.sendTransaction({
        to: ethers.ZeroAddress, // Updated for v6
        value: ethers.parseEther("0.01"),
      });
      console.log("Transaction sent:", tx.hash);

      // Wait for the transaction to be mined
      await tx.wait();
      console.log("Transaction confirmed.");

      // Step 2: Request signature
      const message = "Please sign this message to confirm your vote";
      const signature = await signer.signMessage(message);
      console.log("Signature received:", signature);

      // Step 3: Send vote to the backend
      const voteResponse = await fetch(`http://localhost:5000/api/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          candidateIndex: selectedCandidate,
          signature,
          walletAddress,
        }),
      });

      if (!voteResponse.ok) {
        const errorResponse = await voteResponse.text();
        throw new Error(errorResponse || "Failed to record vote.");
      }

      toast.success("Vote recorded successfully!");
      setVoted(true);
    } catch (error: any) {
      console.error("Error voting:", error);
      toast.error(error.message || "Failed to record vote. Please try again.");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateTimeRemaining = (endDate: string): string => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Voting Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Calculate the leading candidate index
  const getLeadingCandidateIndex = () => {
    if (!event || !event.candidates || event.candidates.length === 0) return -1;

    let maxVotes = -1;
    let leadingIndex = -1;
    let isTie = false;

    event.candidates.forEach((candidate, index) => {
      const votes = candidate.votes || 0;
      if (votes > maxVotes) {
        maxVotes = votes;
        leadingIndex = index;
        isTie = false;
      } else if (votes === maxVotes && votes > 0) {
        isTie = true;
      }
    });

    // Return -1 if there's a tie or no votes
    return isTie || maxVotes === 0 ? -1 : leadingIndex;
  };

  useEffect(() => {
    if (event) {
      const interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(event.endDate));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [event]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!event)
    return <p className="text-center text-gray-600">Event not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-700">Vote Now</h1>
        <p className="mt-2 text-gray-600">
          Participate in active elections and make your voice heard.
        </p>
      </header>

      <Card className="mx-auto max-w-4xl p-6">
        {/* Countdown Timer */}
        <div className="flex items-center justify-center mb-6 text-lg font-semibold text-gray-700">
          <Clock className="w-6 h-6 mr-2" />
          <span>{timeRemaining}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {event.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total Votes:{" "}
              {event.candidates.reduce(
                (sum, candidate) => sum + (candidate.votes || 0),
                0
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>{formatDate(event.endDate)}</span>
          </div>
        </div>

        <div className="space-y-4">
          {event.candidates.map((candidate: any, index: number) => (
            <label
              key={index}
              className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm cursor-pointer ${
                selectedCandidate === index ? "border-2 border-indigo-500" : ""
              }`}
            >
              <div>
                <h3 className="font-semibold">{candidate.name}</h3>
                <p className="text-sm text-gray-600">{candidate.bio}</p>
                <div className="flex items-center mt-2">
                  <div
                    className={`${
                      getLeadingCandidateIndex() === index
                        ? "bg-green-100 text-green-800"
                        : "bg-indigo-100 text-indigo-800"
                    } px-2 py-1 rounded-md text-sm font-medium flex items-center`}
                  >
                    <span className="mr-1">Votes:</span>
                    <span className="font-bold">{candidate.votes || 0}</span>
                    {getLeadingCandidateIndex() === index && (
                      <span className="ml-2 text-xs bg-green-200 px-1 py-0.5 rounded">
                        LEADING
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <input
                type="radio"
                name="candidate"
                value={index}
                checked={selectedCandidate === index}
                onChange={() => setSelectedCandidate(index)}
                className="ml-4"
                disabled={voted || timeRemaining === "Voting Ended"}
              />
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleVote}
            variant="primary"
            disabled={
              voted ||
              timeRemaining === "Voting Ended" ||
              selectedCandidate === null
            }
          >
            {voted ? "Voted" : "Submit Vote"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VoteNow;
