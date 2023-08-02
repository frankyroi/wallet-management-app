import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import WalletTransferModal from './WalletTransferModal';
import WalletWithdrawalModal from './WalletWithdrawalModal';
import TransactionHistory from "./TransactionHistory";
import WalletBalance from "./WalletBalance";
import WalletDepositForm from './WalletDepositForm';
import { isTokenExpired } from "./auth";

interface UserData {
  email: string;
  id: number;
  isAdmin: string;
  name: string;
}

interface WalletData {
  id: number;
  balance: number;
  name: string;
}

interface ApiResponseError {
  response: {
    data: {
      message: string;
    };
  };
}

// Type guard to check if the object is of type ApiResponseError
const isApiResponseError = (error: any): error is ApiResponseError => {
  return error && error.response && typeof error.response.data.message === 'string';
};

const Wallet: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [WalletData, setWalletData] = useState<WalletData | null>(null);
  const [transferModalIsOpen, setTransferModalIsOpen] = useState(false);
  const [withdrawalModalIsOpen, setWithdrawalModalIsOpen] = useState(false);

  useEffect(() => {
    // Fetch user data from the backend after successful login using the JWT token
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        // Define your API call function
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem("accessToken");

            if (token && isTokenExpired(token)) {
              // If the token has expired, log out the user
              handleLogout();
            }
            const response = await axios.get("https://wallet-app-backend-yv9d.onrender.com/api/wallet/getUserAndWalletData",
            {
              headers: {
                "x-auth-token": localStorage.getItem("accessToken")
              },
            });
            // Update state with the user data received from the API
            setUserData(response.data.user);
            setWalletData(response.data.wallet);
          } catch (error) {
            message.error('Error fetching user data.');
          }
        };

      // Call the API function
      fetchUserData();
      }
  }, []);

  const handleDeposit = async (amount: number) => {
    try {
      await axios.post("https://wallet-app-backend-yv9d.onrender.com/api/wallet/deposit", { amount },
      {
        headers: {
          "x-auth-token": localStorage.getItem("accessToken")
        },
      }
      );
        message.success(`$${amount} has been deposited to your wallet.`);
        // Reload the page after a short delay to display the success message
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      // 
      
    } catch (error) {
      message.error("Deposit failed. It is not your fault, please try again.");
    }
  };

  const handleTransfer = async (amount: number, toWalletId: number) => {
    try {
      await axios.post("https://wallet-app-backend-yv9d.onrender.com/api/wallet/transfer", { fromWalletId: WalletData?.id, toWalletId, amount },
      {
        headers: {
          "x-auth-token": localStorage.getItem("accessToken")
        },
      }
      );

      message.success(`$${amount} has been tranferred from your wallet.`);

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      if (isApiResponseError(error)) {
        if (error.response && error.response.data) {
          message.error(`${error.response.data.message}.`);
        } else {
          message.error('Transfer failed.');
        }
      } else {
        message.error('An unknown error occurred during transfer.');
      }
    }
    
  };

  const handleWithdrawal = async (amount: number) => {
    try {
      await axios.post("https://wallet-app-backend-yv9d.onrender.com/api/wallet/withdraw", { fromWalletId: WalletData?.id, amount },
      {
        headers: {
          "x-auth-token": localStorage.getItem("accessToken")
        },
      }
      );

      message.success(`$${amount} has been deducted from your wallet.`);

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      if (isApiResponseError(error)) {
        if (error.response && error.response.data) {
          message.error(`${error.response.data.message}.`);
        } else {
          message.error('Transfer failed.');
        }
      } else {
        message.error('An unknown error occurred during transfer.');
      }
    }
    
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    // Redirect the user to the login page
    window.location.href = "/"; 
  };

  

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-500 p-4">
        <h1 className="text-white text-2xl font-semibold">Wallet</h1>
        <h4 className="text-white font-semibold">{userData?.name}</h4>
      </header>
      <main className="flex-1">
        <div className="flex flex-col md:flex-row justify-evenly space-y-4 md:space-y-0 md:space-x-8 px-8 py-6">
          <div className="w-full md:w-1/2 h-64 bg-white shadow-lg rounded-lg p-4">
            <WalletBalance balance={WalletData?.balance} walletId={WalletData?.id} />
            <div className="flex justify-evenly mt-12">
              <button
                onClick={() => setTransferModalIsOpen(true)}
                className="w-40 md:w-64 bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700"
              >
                Transfer Funds
              </button>
              <button
                onClick={() => setWithdrawalModalIsOpen(true)}
                className="w-40 md:w-64 bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700"
              >
                Withdraw Funds
              </button>
            </div>

            <WalletTransferModal
              isOpen={transferModalIsOpen}
              onClose={() => setTransferModalIsOpen(false)}
              onTransfer={handleTransfer}
            />

            <WalletWithdrawalModal
              isOpen={withdrawalModalIsOpen}
              onClose={() => setWithdrawalModalIsOpen(false)}
              onWithdrawal={handleWithdrawal}
            />
          </div>
          <div className="w-full md:w-1/2 h-64 bg-white shadow-lg rounded-lg p-4">
            <WalletDepositForm onDeposit={handleDeposit} />
          </div>
        </div>

        <div className="w-full">
          <TransactionHistory />
        </div>
      </main>
      <footer className="bg-blue-500 p-4 text-white text-center">
        Footer content here
      </footer>
    </div>

  );
};

export default Wallet;
