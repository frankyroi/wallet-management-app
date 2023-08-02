import React, { useState } from 'react';
import Modal from 'react-modal';

type WalletWithdrawalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onWithdrawal: (amount: number) => void;
};

const customStyles = {
  content: {
    width: '400px', // Set your desired width
    height: '350px', // Set your desired height
    margin: 'auto', // Center the modal horizontally
  },
};



const WalletWithdrawalModal: React.FC<WalletWithdrawalModalProps> = ({ isOpen, onClose, onWithdrawal }) => {
  const [amount, setAmount] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };


  const handleWithdrawal = () => {
    if (parseFloat(amount) > 0) {
      // Call the onWithdrawal function passed as a prop to submit the Withdrawal amount
      onWithdrawal(parseFloat(amount));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Wallet Deposit Modal"
      style={customStyles} 
    >
      <h2 className="text-3xl font-semibold mb-6">Withdraw Funds</h2>

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


      <div>
        <button
          onClick={handleWithdrawal}
          className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700"
        >
          Withdraw
        </button>
      </div>
      

    </Modal>
  );
};

export default WalletWithdrawalModal;
