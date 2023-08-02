import React, { useEffect, useState } from "react";
import { Table, message, Button  } from "antd";
import { isTokenExpired } from "../components/auth";
import axios from "axios";
import { isAdmin } from "../components/auth";
import { Link } from "react-router-dom";

interface UserData {
  email: string;
  id: number;
  isAdmin: boolean;
  name: string;
  isActive: boolean;
}

const UserManagement: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);;

  useEffect(() => {

    // Fetch user data from the backend after successful login using the JWT token
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const fetchAllUsersData = async () => {
          try {
            if (!isAdmin()) {
              window.location.href = "/wallet"; 
            }
            if (accessToken && isTokenExpired(accessToken)) {
              // If the token has expired, log out the user
              handleLogout();
            }
            const response = await axios.get("https://wallet-app-backend-yv9d.onrender.com/api/user",
            {
              headers: {
                "x-auth-token": localStorage.getItem("accessToken")
              },
            });

            // Update state with the user data received from the API
            setUserData(response.data.users);

          } catch (error) {
            message.error('Error fetching user data.');
          }
        };

      // Call the API function
      fetchAllUsersData();
      }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    // Redirect the user to the login page
    window.location.href = "/"; 
  };
  
  const handleToggleActive = async (userId: number, isActive: boolean) => {
    try {
      // Send a PUT request to toggle the user's status
      await axios.put(
        `https://wallet-app-backend-yv9d.onrender.com/api/user/toggle`,
        {
          isActive: !isActive
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("accessToken")
          }
        }
      );
      
      message.success(`User status updated successfully.`);
      // Reload the page after a short delay to display the success message
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("Error while toggling user status:", error);
    }
  };


  const dataSource: UserData[] = userData;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Is Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin: boolean) => (isAdmin ? "ADMIN" : "USER")
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (isActive ? "ACTIVE" : "INACTIVE")
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: UserData) => (
        <Button
          type="primary"
          style={{ backgroundColor: 'blue', borderColor: 'blue' }}
          onClick={() => handleToggleActive(record.id, record.isActive)}
        >
          {record.isActive ? "Disable" : "Enable"}
        </Button>
      )
    }
  ];

  return (
      
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-500 p-4">
        <h1 className="text-white text-2xl font-semibold">User Management</h1>
          
      </header>
      <main className="flex-1">
        <Link to="/create-user">
          <Button
            type="primary"
            className="bg-blue-500 hover:bg-blue-600 mx-3 my-2"
          >
            Create New User
          </Button>
        </Link>
        {/* Display user data using the Ant Design Table component */}
        <Table dataSource={dataSource} columns={columns} rowKey="id"/>
      </main>
    </div>
  );
};

export default UserManagement;
