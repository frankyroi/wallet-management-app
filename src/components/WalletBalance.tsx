import React from 'react';

type WalletBalanceProps = {
  balance: number | undefined;
  walletId: number | undefined
};

const WalletBalance: React.FC<WalletBalanceProps> = ({balance, walletId}) => {

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Your Wallet</h2>
      <p className="text-2xl mt-2">Balance: ${balance}</p>
      <p className="text-2xl mt-2">No#: {walletId}</p>
    </div>
  );
};

export default WalletBalance;