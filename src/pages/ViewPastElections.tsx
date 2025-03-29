import React, { useEffect, useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewPastElections = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);

  useEffect(() => {
    // Fetch past elections from the backend
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setElections(data));
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Past Elections</h1>
      <p className="text-gray-600 mb-8">View details of all past elections.</p>

      {/* Elections List */}
      <div className="space-y-4">
        {elections.length > 0 ? (
          elections.map((election, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center cursor-pointer"
              onClick={() => navigate(`/election-details/${election.id}`)}
            >
              <div>
                <h3 className="font-semibold">{election.title}</h3>
                <p className="text-sm text-gray-600">
                  Total Votes: {election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)}
                </p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No past elections available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewPastElections;