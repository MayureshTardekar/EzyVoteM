import { Calendar, Clock, Trash2, X } from "lucide-react"; // Added X icon for delete
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import BackToTopButton from "./BackToTopButton";

const UpcomingElections = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]); // State to store upcoming elections
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isClearPopupOpen, setIsClearPopupOpen] = useState(false); // Clear all popup state
  const [deleteElectionId, setDeleteElectionId] = useState(null); // Delete specific election popup state
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket("ws://localhost:5000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected - attempting reconnect...");
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "newEvent") {
          console.log("New event received:", message.data);
          setElections((prevElections) => {
            const updatedElections = [...prevElections, message.data];
            const sortedElections = sortElectionsByDateTime(updatedElections);
            localStorage.setItem(
              "upcomingElections",
              JSON.stringify(sortedElections)
            );
            return sortedElections;
          });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
  };

  const loadInitialEvents = async () => {
    try {
      // First load from localStorage
      const savedElections = localStorage.getItem("upcomingElections");
      if (savedElections) {
        setElections(JSON.parse(savedElections));
      }

      // Then fetch fresh data from server
      const response = await fetch("http://localhost:5000/api/events");
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const sortedEvents = sortElectionsByDateTime(data);
      setElections(sortedEvents);
      localStorage.setItem("upcomingElections", JSON.stringify(sortedEvents));
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const sortElectionsByDateTime = (events) => {
    return events.sort((a, b) => {
      const aDateTime = new Date(`${a.startDate}T${a.startTime}`);
      const bDateTime = new Date(`${b.startDate}T${b.startTime}`);
      return aDateTime.getTime() - bDateTime.getTime();
    });
  };

  useEffect(() => {
    loadInitialEvents();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Add these helper functions at the top of your component
  const toLocalDateTime = (dateStr: string, timeStr: string): Date => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  const calculateTimeRemaining = (endDate: string, endTime: string): string => {
    try {
      const now = new Date();
      const end = toLocalDateTime(endDate, endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) return "Expired";

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hours}h ${minutes}m ${seconds}s`;
    } catch (err) {
      return "Invalid";
    }
  };

  const getEventStatus = (
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ): string => {
    const now = new Date();

    if (!startDate || !startTime || !endDate || !endTime) return "Invalid";

    try {
      const start = toLocalDateTime(startDate, startTime);
      const end = toLocalDateTime(endDate, endTime);

      // Debug logs
      console.log("Status check:", {
        now: now.toLocaleString(),
        start: start.toLocaleString(),
        end: end.toLocaleString(),
      });

      if (now < start) return "Upcoming";
      if (now >= start && now <= end) return "Active";
      return "Ended";
    } catch (err) {
      console.error("Date parsing error:", err);
      return "Invalid";
    }
  };

  // Periodically update the status of events
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setElections((prevElections) => {
        const updatedElections = prevElections.map((election) => {
          const currentStatus = getEventStatus(
            election.startDate,
            election.startTime,
            election.endDate,
            election.endTime
          );

          // Only update if status has changed
          if (election.status !== currentStatus) {
            return { ...election, status: currentStatus };
          }
          return election;
        });

        // Only trigger re-render if there are actual changes
        const hasStatusChanges = updatedElections.some(
          (updated, index) => updated.status !== prevElections[index].status
        );

        if (hasStatusChanges) {
          localStorage.setItem(
            "upcomingElections",
            JSON.stringify(updatedElections)
          );
          return updatedElections;
        }
        return prevElections;
      });
    }, 1000);

    return () => clearInterval(statusInterval);
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
      const updatedElections = elections.filter(
        (election) => election.id !== deleteElectionId
      );
      setElections(updatedElections); // Update state
      localStorage.setItem(
        "upcomingElections",
        JSON.stringify(updatedElections)
      ); // Update localStorage
      setDeleteElectionId(null); // Close the popup
    }
  };

  return (
    <div className="flex-1 transition-all duration-300 mt-[-50px] p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 text-center mb-8">
        <h1 className="text-4xl font-bold">Upcoming Elections</h1>
        <p className="mt-2 text-lg">
          Stay informed about upcoming voting events.
        </p>
      </div>

      {/* Elections List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-gray-600 text-center col-span-full">
            Loading elections...
          </p>
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
                className={`p-6 text-center hover:shadow-lg transition-shadow relative
                  ${
                    election.isSecure
                      ? "border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white"
                      : ""
                  }`}
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

                {/* Secure Badge */}
                {election.isSecure && (
                  <div className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded bg-amber-500 text-white">
                    Secure
                  </div>
                )}

                {/* Delete Button for Ended Elections */}
                {status === "Ended" && (
                  <button
                    onClick={() => setDeleteElectionId(election.id)}
                    className="absolute top-2 left-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    election.isSecure ? "text-amber-800" : "text-gray-900"
                  }`}
                >
                  {election.title}
                </h3>
                <p className="text-gray-600 mb-4">{election.candidateBio}</p>
                <div className="text-sm text-gray-500 mb-2">
                  Time remaining:{" "}
                  {calculateTimeRemaining(election.endDate, election.endTime)}
                </div>
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
          <p className="text-gray-600 text-center col-span-full">
            No upcoming elections at the moment.
          </p>
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
              <Button
                onClick={() => setIsClearPopupOpen(false)}
                variant="secondary"
              >
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
              <Button
                onClick={() => setDeleteElectionId(null)}
                variant="secondary"
              >
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
