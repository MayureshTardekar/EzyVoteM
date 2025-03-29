import React, { useEffect, useState } from "react";
import { Shield, Vote, Clock } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";

const SecurelyVoting = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedEventIds, setVotedEventIds] = useState([]);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([]);

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

  const handleVote = async (eventId) => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask to vote");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Check if address is whitelisted
      if (!whitelistedAddresses.includes(address.toLowerCase())) {
        toast.error("You are not authorized to vote in this election");
        return;
      }

      // Request transaction
      const tx = await signer.sendTransaction({
        to: "0x2EBCF132340C1a3eBBc0605A9abF08082F0c69e6", // Replace with your contract address
        value: ethers.utils.parseEther("0.01") // Optional: Add value if needed
      });
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Request signature
      const message = "Please sign this message to confirm your vote";
      const signature = await signer.signMessage(message);
      
      toast.success("Vote recorded successfully!");
      setVotedEventIds((prev) => [...prev, eventId]);
      
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to record vote");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-700">Securely Voting</h1>
        <p className="mt-2 text-gray-600">Participate in secure elections with whitelisted addresses.</p>
      </header>

      <Card className="mx-auto max-w-4xl p-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(event.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <Button
                onClick={() => handleVote(event._id)}
                variant="primary"
                className="w-full mt-4"
                disabled={votedEventIds.includes(event._id)}
              >
                {votedEventIds.includes(event._id) ? "Voted" : "Vote Securely"}
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No secure elections available at the moment.</p>
        )}
      </Card>
    </div>
  );
};

export default SecurelyVoting;