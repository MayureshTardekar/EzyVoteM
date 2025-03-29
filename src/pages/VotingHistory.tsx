import React from "react";
import { Clock, FileText, BarChart } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const VotingHistory = () => {
  const navigate = useNavigate();

  const historyFeatures = [
    {
      title: "View Past Elections",
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      description: "Explore all past elections and their results.",
      onClick: () => navigate("/past-elections"),
    },
    {
      title: "Download Reports",
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      description: "Generate and download detailed election reports.",
      onClick: () => navigate("/download-reports"),
    },
    {
      title: "Analytics",
      icon: <BarChart className="h-8 w-8 text-indigo-600" />,
      description: "Analyze voting trends and patterns.",
      onClick: () => navigate("/voting-analytics"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Voting History</h1>
        <p className="mt-2 text-lg">Explore past elections and voting data.</p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {historyFeatures.map((feature, index) => (
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
    </div>
  );
};

export default VotingHistory;