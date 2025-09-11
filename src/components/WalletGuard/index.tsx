'use client';
import React from 'react';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Wallet } from 'lucide-react';

interface WalletGuardProps {
  children: React.ReactNode;
}

const WalletGuard: React.FC<WalletGuardProps> = ({ children }) => {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-orange-500 flex flex-col items-center justify-center px-4 relative">
        {/* Title */}
        <div className="text-center mb-8">
          <img 
            src="/login/name.png" 
            alt="A complete app for your health"
            className="mx-auto max-w-xs h-auto"
          />
        </div>

        {/* Character illustration */}
        <div className="mb-16">
          <img 
            src="/login/character.png" 
            alt="Fitness character"
            className="mx-auto w-48 h-48 object-contain"
          />
        </div>

        {/* Connect Wallet Button */}
        <div className="w-full max-w-sm mb-4">
          <button
            onClick={() => open()}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-2xl text-lg border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-lg transition-all duration-200 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 flex items-center justify-center gap-3"
          >
            <Wallet className="w-6 h-6" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WalletGuard;