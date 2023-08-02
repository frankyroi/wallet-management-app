// src/components/WalletDepositForm.tsx
import React, { useState } from 'react';

type WalletDepositFormProps = {
  onDeposit: (amount: number) => void;
};

const WalletDepositForm: React.FC<WalletDepositFormProps> = ({ onDeposit }) => {
  const [amount, setAmount] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(amount) > 0) {
      onDeposit(parseFloat(amount));
      setAmount(''); // Clear the input field after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
        <h2 className="text-2xl font-bold mb-2">Deposit Funds</h2>
        <div className="flex items-center">
        <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter deposit amount"
            className="rounded-l-md px-4 py-2 w-96 border-t border-b border-l text-gray-700 focus:outline-none"
        />
        <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-r-md"
        >
            Deposit
        </button>
        </div>
    </form>
  );
};

export default WalletDepositForm;
