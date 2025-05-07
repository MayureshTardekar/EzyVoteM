import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletProvider } from "./components/WalletContext";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <WalletProvider>
        <div className="App">
          <Navbar />
          <AppRoutes />
          <ToastContainer />
        </div>
      </WalletProvider>
    </Router>
  );
}

export default App;
