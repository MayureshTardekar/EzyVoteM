import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import { createRoot } from "react-dom/client"; // React 18 fix

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Dashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import Tutorials from "./pages/Tutorials";
import Notifications from "./pages/Notifications";
import CreateEvent from "./pages/CreateEvent";
import VotingHistory from "./pages/VotingHistory";
import Sidebar from "./components/Sidebar";

import LanguageSelector from "./components/LanguageSelector";
import { WalletProvider } from "./components/WalletContext"; // Import WalletProvider
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./i18n";
import SystemLogs from "./pages/SystemLogs";
import LiveResults from "./pages/LiveResults";
import DashboardAnalytics from "./components/DashboardAnalytics";
import VoteNow from "./pages/VoteNow";
import UpcomingElections from "./components/UpcomingElections";
import DownloadReports from "./pages/DownloadReports";
import ViewPastElections from "./pages/ViewPastElections";
import SecurelyVoting from "./pages/SecurelyVoting";
import CreateSecureEvent from "./pages/CreateSecurePage";

const clientId =
  "618985753544-ru0sgmr1ad4fcmpgpaj8p1v2iopbhbnm.apps.googleusercontent.com";

const root = createRoot(document.getElementById("root")!); // React 18 syntax

root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <WalletProvider>
      <App />
    </WalletProvider>
  </GoogleOAuthProvider>
);

function App() {
  const { i18n } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      i18n.changeLanguage(i18n.language);
    }

    // Fetch user role from local storage
    const role = localStorage.getItem("userRole") as "user" | "admin" | null;
    setUserRole(role);
  }, [i18n]);

  return (
    <Auth0Provider
      domain="YOUR_AUTH0_DOMAIN"
      clientId="YOUR_AUTH0_CLIENT_ID"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <Router>
        <Routes>
          {/* Public Layout (Navbar only) */}
          <Route
            element={
              <div className="min-h-screen bg-gray-50">
                <Navbar /> {/* Navbar will handle wallet logic inside */}
                <Outlet />
              </div>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
          </Route>

          {/* Authenticated Layout (Sidebar only) */}
          <Route
            element={
              <div className="min-h-screen bg-gray-50 flex">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={false} />
                <div
                  className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-48" : "ml-20"} p-6`}
                >
                  <Outlet />
                </div>
              </div>
            }
          >
            {/* Correct Dashboard Redirect */}
            <Route path="/user-dashboard" element={<Dashboard isSidebarOpen={isSidebarOpen} />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/create-secure-event" element={<CreateSecureEvent />} />
            <Route path="/voting-history" element={<VotingHistory />} />
            <Route path="/past-elections" element={<ViewPastElections />} />
            <Route path="/download-reports" element={<DownloadReports />} />
            <Route path="/system-logs" element={<SystemLogs />} />
            <Route path="/upcoming-elections" element={<UpcomingElections />} />
            <Route path="/dashboard-analytics" element={<DashboardAnalytics />} />
            <Route path="/vote-now/:eventId" element={<VoteNow />} />
            <Route path="/live-results" element={<LiveResults />} />
            <Route path="/securely-voting" element={<SecurelyVoting />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Router>
    </Auth0Provider>
  );
}

/**
 * Component to Redirect Users Based on Role
 */
function NavigateToDashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (userRole === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  }, [userRole, navigate]);

  return null; // No need to render anything
}

export default App;