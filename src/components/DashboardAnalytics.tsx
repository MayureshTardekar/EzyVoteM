import React from "react";
import { BarChart, PieChart, LineChart } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DashboardAnalytics = () => {
  const navigate = useNavigate();

  const analyticsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Votes Cast",
        data: [120, 190, 300, 250, 200, 350],
        backgroundColor: "rgba(79, 70, 229, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Completed", "Ongoing", "Upcoming"],
    datasets: [
      {
        label: "Elections",
        data: [12, 5, 3],
        backgroundColor: ["#4F46E5", "#F59E0B", "#10B981"],
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Voter Turnout",
        data: [80, 85, 90, 88, 92, 95],
        borderColor: "#4F46E5",
        fill: false,
      },
    ],
  };

  const analyticsFeatures = [
    {
      title: "Voting Trends",
      icon: <BarChart className="h-8 w-8 text-indigo-600" />,
      description: "Analyze voting trends over time.",
      onClick: () => navigate("/voting-trends"),
    },
    {
      title: "Election Distribution",
      icon: <PieChart className="h-8 w-8 text-indigo-600" />,
      description: "View the distribution of elections by status.",
      onClick: () => navigate("/election-distribution"),
    },
    {
      title: "Voter Turnout",
      icon: <LineChart className="h-8 w-8 text-indigo-600" />,
      description: "Track voter turnout rates over time.",
      onClick: () => navigate("/voter-turnout"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Dashboard Analytics</h1>
        <p className="mt-2 text-lg">Gain insights into voting trends and election data.</p>
      </div>

      {/* Analytics Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsFeatures.map((feature, index) => (
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

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Voting Trends</h2>
          <Bar data={analyticsData} />
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Election Distribution</h2>
          <Pie data={pieData} />
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Voter Turnout</h2>
          <Line data={lineData} />
        </Card>
      </div>
    </div>
  );
};

export default DashboardAnalytics;