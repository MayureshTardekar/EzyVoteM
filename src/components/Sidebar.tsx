// src/components/Sidebar.tsx
import { motion } from "framer-motion";
import { BarChart, Bell, Book, Home, LogOut, Menu, X } from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "./WalletContext"; // Assuming you're using WalletContext

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  isMobile,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { disconnectWallet, userRole } = useWallet(); // Use wallet disconnect function and userRole

  // Common navigation items for both user and admin
  const commonNavItems = [
    {
      path: "/reports",
      icon: <BarChart className="h-6 w-6" />,
      label: "Reports",
    },
    {
      path: "/tutorials",
      icon: <Book className="h-6 w-6" />,
      label: "Tutorials",
    },
    {
      path: "/notifications",
      icon: <Bell className="h-6 w-6" />,
      label: "Notifications",
    },
  ];

  // Role-specific navigation items
  const userNavItems = [
    {
      path: "/user-dashboard",
      icon: <Home className="h-6 w-6" />,
      label: "Dashboard",
    },
  ];

  const adminNavItems = [
    {
      path: "/admin-dashboard",
      icon: <Home className="h-6 w-6" />,
      label: "Dashboard",
    },
  ];

  // Combine common and role-specific navigation items
  const navItems = [
    ...(userRole === "admin" ? adminNavItems : userNavItems),
    ...commonNavItems,
  ];

  // Function to handle wallet disconnection
  const handleDisconnect = async () => {
    await disconnectWallet(); // Disconnect wallet
    navigate("/"); // Redirect to home page after disconnecting
  };

  return (
    <motion.div
      className={`bg-gradient-to-t from-indigo-600 to-purple-600 text-white h-screen fixed top-0 left-0 z-40 transition-all duration-300 ${
        isOpen ? "w-48" : isMobile ? "w-0" : "w-20"
      }`}
      initial={{ x: isMobile ? "-100%" : "0" }}
      animate={{ x: isOpen || !isMobile ? "0" : "-100%" }}
      transition={{ type: "spring", stiffness: 80 }}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && (
          <Link to="/" className="flex items-center space-x-2 group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-vote h-8 w-8 transform transition-transform duration-300 group-hover:rotate-12"
            >
              <path d="m9 12 2 2 4-4"></path>
              <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"></path>
              <path d="M22 19H2"></path>
            </svg>
            <span className="font-bold text-lg hover:text-purple-200 transition-colors">
              EzyVote
            </span>
          </Link>
        )}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-white text-xl focus:outline-none hover:bg-indigo-800 space-x-3 p-2 rounded-md"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        )}
      </div>

      <div className="mt-10 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-4 p-4 hover:bg-indigo-800 rounded-md relative ${
              !isOpen && !isMobile ? "justify-center" : ""
            } ${location.pathname === item.path ? "bg-indigo-800" : ""}`}
          >
            {item.icon}
            {(isOpen || isMobile) && (
              <span className="whitespace-nowrap">
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Disconnect Button */}
      <div className="absolute bottom-0 left-0 w-full p-4">
        <button
          onClick={handleDisconnect} // Call handleDisconnect instead of logout
          className="flex items-center space-x-4 p-4 hover:bg-indigo-800 rounded-md w-full"
        >
          <LogOut className="h-6 w-6" />
          {(isOpen || isMobile) && (
            <span className="whitespace-nowrap">Disconnect</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
