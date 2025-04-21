import { ethers } from "ethers";
import { Clock, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import Card from "../components/Card";
import { useWallet } from "../components/WalletContext";

interface EventType {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  // ... other event properties
}

const toLocalDateTime = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
};

const VoteNow = () => {
  const { eventId } = useParams(); // Get the eventId from the URL
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  const [timeRemaining, setTimeRemaining] = useState("");
  const [votingStatus, setVotingStatus] = useState<
    "upcoming" | "active" | "ended"
  >("upcoming");
  const { walletAddress, isWalletConnected, connectWallet } = useWallet();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef(null);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use ref to always access latest event data
  const eventRef = useRef<EventType | null>(null);

  // Update ref whenever event changes
  useEffect(() => {
    eventRef.current = event;
  }, [event]);

  const updateVotingStatus = () => {
    const e = eventRef.current;
    if (!e) return;

    try {
      const start = toLocalDateTime(e.startDate, e.startTime);
      const end = toLocalDateTime(e.endDate, e.endTime);
      const nowMs = new Date().getTime();
      const startMs = start.getTime();
      const endMs = end.getTime();

      // Debug logging
      console.log("Status Check:", {
        now: new Date().toISOString(),
        start: start.toISOString(),
        end: end.toISOString(),
        diffToStart: (startMs - nowMs) / 1000,
        diffToEnd: (endMs - nowMs) / 1000,
      });

      if (nowMs < startMs) {
        setVotingStatus("upcoming");
        setTimeRemaining(calculateTimeUntilStart(start));
      } else if (nowMs <= endMs) {
        setVotingStatus("active");
        setTimeRemaining(calculateTimeRemaining(end));
      } else {
        setVotingStatus("ended");
        setTimeRemaining("Voting Ended");
      }
    } catch (error) {
      console.error("Error in updateVotingStatus:", error);
      setVotingStatus("ended");
      setTimeRemaining("Error: Invalid date/time");
    }
  };

  const calculateTimeUntilStart = (startDate: Date): string => {
    const now = new Date();
    const diff = startDate.getTime() - now.getTime();

    if (diff <= 0) return "Starting soon";
    return formatTimeRemaining(diff);
  };

  const calculateTimeRemaining = (endDate: Date): string => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) return "Voting Ended";
    return formatTimeRemaining(diff);
  };

  const formatTimeRemaining = (diff: number): string => {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/events/${eventId}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        validateEventData(data);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // Set up status update interval
    const intervalId = setInterval(updateVotingStatus, 1000);
    statusIntervalRef.current = intervalId;

    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, [eventId]);

  // Validate event data
  const validateEventData = (data: any) => {
    const requiredFields = ["startDate", "startTime", "endDate", "endTime"];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Invalid event data: missing ${field}`);
      }
    }
  };

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

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      validateEventData(data);

      setEvent(data);
      // Status will update automatically via useEffect
    } catch (error) {
      console.error("Error refreshing event:", error);
      toast.error("Failed to refresh event details");
    } finally {
      setLoading(false);
    }
  };

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
        {/* Refresh button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{event?.title}</h1>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Status display */}
        <div className="mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span
            className={`
            ${votingStatus === "upcoming" ? "text-blue-500" : ""}
            ${votingStatus === "active" ? "text-green-500" : ""}
            ${votingStatus === "ended" ? "text-red-500" : ""}
          `}
          >
            {votingStatus === "upcoming" && "Upcoming: "}
            {votingStatus === "active" && "Active: "}
            {votingStatus === "ended" && "Ended"}
            {timeRemaining && votingStatus !== "ended" && timeRemaining}
          </span>
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
