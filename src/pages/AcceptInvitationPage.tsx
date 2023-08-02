import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { isLoggedIn } from "../components/auth";

const AcceptInvitationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    // Make an API call to your backend to accept the invitation using the provided token
    const acceptInvitation = async () => {
      try {
        const response = await axios.put(`https://wallet-app-backend-yv9d.onrender.com/api/auth/acceptInvitation`,{
            token: token
        },);
        
        console.log(response.data.message);
        message.success(response.data.message);
        // Reload the page after a short delay to display the success message
        setTimeout(() => {
          if (isLoggedIn()) {
            handleLogout();
          } else {
            window.location.href = "/"; 
          }
            
        }, 1000);
      } catch (error) {
        console.error("Error accepting invitation:", error);
        // Handle errors, e.g., display an error message or redirect to an error page
        message.error("Error accepting invitation");
        setTimeout(() => {
          if (isLoggedIn()) {
            handleLogout();
          } else {
            window.location.href = "/"; 
          }
            
        }, 1000);
      }
    };

    acceptInvitation();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/"; 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full py-8 px-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl text-center mb-6">Accepting Invitation...</h1>
        </div>
    </div>
  );
};

export default AcceptInvitationPage;
