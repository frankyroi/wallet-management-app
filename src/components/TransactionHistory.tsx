import React from 'react';

const TransactionHistory: React.FC = () => {
  const transactions = [
    { id: 1, amount: 50, description: 'Direct Deposit', type: 'credit' },
    { id: 2, amount: 30, description: 'Transfer to John', type: 'debit' },
  ];

  return (
    <div className="p-4 bg-gray-300">
      <h2 className="text-xl font-semibold">Transaction History</h2>
      <ul className="mt-4">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="flex justify-between mb-2">
            <span>{transaction.description}</span>
            <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
              {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
