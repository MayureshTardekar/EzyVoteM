import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Users,
  Settings,
  FileText,
  Clock,
  Shield,
  Activity,
  BookOpen,
  KeyIcon,
  KeySquare,
  LockKeyhole,
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import BackToTopButton from "../components/BackToTopButton";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Admin features
  const adminFeatures = [
    {
      title: "Create Event",
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      description: "Set up new voting events with customizable options.",
      onClick: () => navigate("/create-event"),
    },
    {
      title: "Create Secure Event",
      icon: <LockKeyhole className="h-8 w-8 text-indigo-600" />,
      description: "Set up new secure voting events with more privacy options.",
      onClick: () => navigate("/create-secure-event"),
    },
    {
      title: "View Reports",
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      description: "Analyze voting results and generate detailed reports.",
      onClick: () => navigate("/reports"),
    },
    {
      title: "Voting History",
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      description: "View detailed logs of all past voting activities.",
      onClick: () => navigate("/voting-history"),
    },
    {
      title: "Live Results",
      icon: <Activity className="h-8 w-8 text-indigo-600" />,
      description: "Monitor real-time voting results and analytics.",
      onClick: () => navigate("/live-results"),
    },
    {
      title: "System Logs",
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      description: "Access system logs for debugging and monitoring.",
      onClick: () => navigate("/system-logs"),
    },
  ];

  return (
    <div
      className={`flex-1 transition-all duration-300 mt-[-50px] p-6`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 text-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-lg">Manage your platform with ease and efficiency.</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminFeatures.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Button onClick={feature.onClick} variant="primary" className="w-full">
                {feature.title}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
      <BackToTopButton />
    </div>
  );
};

export default AdminDashboard;