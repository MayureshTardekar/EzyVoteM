import React, { useEffect, useState } from "react";
import { Activity, BarChart, Users } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const LiveResults = () => {
  const navigate = useNavigate();
  const [voteData, setVoteData] = useState([]);

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket("ws://localhost:5000");

    // Listen for messages from the server
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "voteUpdate") {
        // Update the vote data in real-time
        setVoteData((prevData) => {
          const newData = [...prevData];
          const eventIndex = newData.findIndex(
            (item) => item.eventId === data.data.eventId
          );

          if (eventIndex !== -1) {
            newData[eventIndex].candidates[data.data.candidateIndex].votes =
              data.data.updatedVoteCount;
          }

          return newData;
        });
      }
    };

    // Cleanup WebSocket connection on unmount
    return () => {
      ws.close();
    };
  }, []);

  const liveFeatures = [
    {
      title: "Real-Time Results",
      icon: <Activity className="h-8 w-8 text-indigo-600" />,
      description: "Monitor live voting results as they come in.",
      onClick: () => navigate("/real-time-results"),
    },
    {
      title: "Analytics Dashboard",
      icon: <BarChart className="h-8 w-8 text-indigo-600" />,
      description: "View detailed analytics and insights.",
      onClick: () => navigate("/analytics-dashboard"),
    },
    {
      title: "Voter Participation",
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      description: "Track voter turnout and participation rates.",
      onClick: () => navigate("/voter-participation"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Live Results</h1>
        <p className="mt-2 text-lg">Track live voting results and analytics.</p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveFeatures.map((feature, index) => (
          <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <Button onClick={feature.onClick} variant="primary" className="w-full">
              {feature.title}
            </Button>
          </Card>
        ))}
      </div>

      {/* Real-Time Vote Data */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Votes</h2>
        <ul>
          {voteData.map((event, index) => (
            <li key={index} className="mb-4">
              <h3 className="text-xl font-semibold text-indigo-600">{event.title}</h3>
              <ul>
                {event.candidates.map((candidate, idx) => (
                  <li key={idx}>
                    {candidate.name}: {candidate.votes} votes
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LiveResults;