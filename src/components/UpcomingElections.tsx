import React, { useEffect, useState } from "react";
import { Calendar, Clock, Vote, Trash2, X } from "lucide-react"; // Added X icon for delete
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import BackToTopButton from "./BackToTopButton";

const UpcomingElections = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]); // State to store upcoming elections
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isClearPopupOpen, setIsClearPopupOpen] = useState(false); // Clear all popup state
  const [deleteElectionId, setDeleteElectionId] = useState(null); // Delete specific election popup state

  useEffect(() => {
    // Load elections from localStorage on component mount
    const savedElections = localStorage.getItem("upcomingElections");
    if (savedElections) {
      setElections(JSON.parse(savedElections));
    }

    // Establish WebSocket connection
    const socket = new WebSocket("ws://localhost:5000");

    // Listen for messages from the server
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "newEvent") {
          console.log("New event received:", message.data);
          // Add the new event to the elections list
          setElections((prevElections) => {
            const updatedElections = [...prevElections, message.data];
            // Sort events by start date and time
            const sortedElections = updatedElections.sort((a, b) => {
              const aDateTime = new Date(`${a.startDate || ""}T${a.startTime || ""}`);
              const bDateTime = new Date(`${b.startDate || ""}T${b.startTime || ""}`);
              return aDateTime.getTime() - bDateTime.getTime();
            });
            // Save updated elections to localStorage
            localStorage.setItem("upcomingElections", JSON.stringify(sortedElections));
            return sortedElections;
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };

    // Handle WebSocket errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsLoading(false); // Mark loading as complete
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);

  // Function to determine the status of an event
  const getEventStatus = (
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ): string => {
    const now = new Date();
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (now >= startDateTime && now <= endDateTime) {
      return "Active"; // Event is currently active
    } else if (now < startDateTime) {
      return "Upcoming"; // Event is yet to start
    } else {
      return "Ended"; // Event has ended
    }
  };

  // Periodically update the status of events
  useEffect(() => {
    const interval = setInterval(() => {
      setElections((prevElections) => {
        // Check if any event's status has changed
        const updatedElections = prevElections.map((election) => {
          const status = getEventStatus(
            election.startDate,
            election.startTime,
            election.endDate,
            election.endTime
          );
          return { ...election, status }; // Add the status to each election object
        });

        // Only update state if there's a change in status
        if (
          JSON.stringify(updatedElections) !== JSON.stringify(prevElections)
        ) {
          return updatedElections;
        }
        return prevElections;
      });
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Helper function to format date as dd/mm/yyyy
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to clear all elections
  const handleClearElections = () => {
    setElections([]); // Clear the state
    localStorage.removeItem("upcomingElections"); // Clear from localStorage
    setIsClearPopupOpen(false); // Close the popup
  };

  // Function to delete a specific election
  const handleDeleteElection = () => {
    if (deleteElectionId) {
      const updatedElections = elections.filter((election) => election.id !== deleteElectionId);
      setElections(updatedElections); // Update state
      localStorage.setItem("upcomingElections", JSON.stringify(updatedElections)); // Update localStorage
      setDeleteElectionId(null); // Close the popup
    }
  };

  return (
    <div className="flex-1 transition-all duration-300 mt-[-50px] p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 text-center mb-8">
        <h1 className="text-4xl font-bold">Upcoming Elections</h1>
        <p className="mt-2 text-lg">Stay informed about upcoming voting events.</p>
      </div>

      {/* Elections List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-gray-600 text-center col-span-full">Loading elections...</p>
        ) : elections.length > 0 ? (
          elections.map((election) => {
            const status = getEventStatus(
              election.startDate,
              election.startTime,
              election.endDate,
              election.endTime
            );
            return (
              <Card
                key={election.id}
                className="p-6 text-center hover:shadow-lg transition-shadow relative" // Added 'relative' for positioning
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded ${
                    status === "Active"
                      ? "bg-green-500 text-white"
                      : status === "Upcoming"
                      ? "bg-blue-500 text-white"
                      : "bg-red-400 text-white"
                  }`}
                >
                  {status}
                </div>
                {/* Delete Button for Ended Elections */}
                {status === "Ended" && (
                  <button
                    onClick={() => setDeleteElectionId(election.id)}
                    className="absolute top-2 left-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{election.title}</h3>
                <p className="text-gray-600 mb-4">{election.candidateBio}</p>
                <div className="flex justify-center items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Start:{" "}
                    {election.startDate
                      ? `${formatDate(election.startDate)} ${
                          election.startTime || "Not specified"
                        }`
                      : "Not specified"}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-2 text-gray-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>
                    End:{" "}
                    {election.endDate
                      ? `${formatDate(election.endDate)} ${
                          election.endTime || "Not specified"
                        }`
                      : "Not specified"}
                  </span>
                </div>
                {/* Conditional Button */}
                {status === "Active" ? (
                  <Button
                    onClick={() => navigate(`/vote-now/${election.id}`)}
                    variant="primary"
                    className="w-full"
                  >
                    Vote Now
                  </Button>
                ) : status === "Upcoming" ? (
                  <Button
                    variant="secondary"
                    className="w-full cursor-not-allowed"
                    disabled
                  >
                    Starts Soon
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full cursor-not-allowed"
                    disabled
                  >
                    Election Ended
                  </Button>
                )}
              </Card>
            );
          })
        ) : (
          <p className="text-gray-600 text-center col-span-full">No upcoming elections at the moment.</p>
        )}
      </div>

      {/* Clear Elections Button */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => setIsClearPopupOpen(true)}
          variant="danger"
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Clear All Elections
        </Button>
      </div>

      {/* Clear All Elections Popup */}
      {isClearPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Clear All Elections</h2>
            <p>Are you sure you want to clear all elections?</p>
            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={() => setIsClearPopupOpen(false)} variant="secondary">
                No
              </Button>
              <Button onClick={handleClearElections} variant="danger">
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Election Popup */}
      {deleteElectionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Delete Election</h2>
            <p>Are you sure you want to delete this election?</p>
            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={() => setDeleteElectionId(null)} variant="secondary">
                No
              </Button>
              <Button onClick={handleDeleteElection} variant="danger">
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    <BackToTopButton />
    </div>
  );
};

export default UpcomingElections;