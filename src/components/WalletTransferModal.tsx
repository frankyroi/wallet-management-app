import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

type WalletTransferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (amount: number, toWalletId: number) => void;
};


const customStyles = {
  content: {
    width: '400px', // Set your desired width
    height: '360px', // Set your desired height
    margin: 'auto', // Center the modal horizontally
  },
};



const WalletTransferModal: React.FC<WalletTransferModalProps> = ({ isOpen, onClose, onTransfer }) => {
  const [amount, setAmount] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [walletName, setWalletName] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToWalletId(e.target.value);
    setWalletName("");
  };

  const handleTransfer = () => {
    if (parseFloat(amount) > 0) {
      // Call the onTransfer function passed as a prop to submit the deposit amount
      onTransfer(parseFloat(amount), parseInt(toWalletId) );
    }
  };

  const fetchWalletName = async () => {
    try {
      // Make an API call to fetch the wallet name based on the wallet ID
      const response = await axios.get(`http://localhost:5001/api/wallet/data/${toWalletId}`,{
        headers: {
          "x-auth-token": localStorage.getItem("accessToken")
        },
      });
      // Update the walletName state with the fetched data
      setWalletName(response.data.wallet.name);
    } catch (error) {
      console.error('Error fetching wallet name:', error);
    }
  };
  
  useEffect(() => {
    // Fetch the wallet name when the toWalletId state changes
    if (toWalletId !== '') {
      fetchWalletName();
    }
  }, [toWalletId]);



  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Wallet Deposit Modal"
      style={customStyles} 
    >
      <h2 className="text-3xl font-semibold mb-6">Transfer Funds</h2>

      <div className="mb-6">
        <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="wallet" className="block text-gray-700 text-sm font-bold mb-2">Wallet</label>
        <input
          type="number"
          value={toWalletId}
          onChange={handleWalletChange}
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
          required
        />
        {walletName ? <p className="text-sm text-gray-500 mt-1">{walletName}</p> : "..."}
      </div>

      <div>
        <button
          onClick={handleTransfer}
          disabled={!amount || !toWalletId}
          className={`w-full py-2 rounded focus:outline-none focus:ring ${
            !amount || !toWalletId
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 focus:border-blue-700"
          }`}
        >
          Transfer
        </button>
      </div>
    </Modal>
  );
};

export default WalletTransferModal;
