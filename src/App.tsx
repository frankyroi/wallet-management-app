import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Wallet from "./pages/Wallet";
import WalletManagement from "./pages/UserManagement";
import AcceptInvitationPage from "./pages/AcceptInvitationPage";
import CreateUserPage from "./pages/CreateUserPage";
import { isAdmin } from "./components/auth";

const App: React.FC = () => {
  // Function to check if the user is logged in (you can implement this based on your token handling)
  const isLoggedIn = () => {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    // Redirect the user to the login page
    window.location.href = "/"; 
  };

  return (
    <Router>
      {isLoggedIn() && ( // Only show the navigation when logged in
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/wallet" className="text-white hover:text-gray-300">
              Wallet
              </Link>
            </li>
            <li>
              {isAdmin() && (
                <li>
                  <Link
                    to="/user-management"
                    className="text-white hover:text-gray-300"
                  >
                    User Management
                  </Link>
                </li>
              )}
            </li>
            <li>
              <p onClick={handleLogout} className="text-white hover:text-gray-300 cursor-pointer">
                Logout
              </p>
            </li>
          </ul>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/accept-invitation/:token" element={<AcceptInvitationPage />} />
        <Route
          path="/wallet"
          element={
            isLoggedIn() ? (
              <Wallet />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/user-management"
          element={
            isLoggedIn() ? (
              <WalletManagement />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/create-user"
          element={
            isLoggedIn() ? (
              <CreateUserPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Handle unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
