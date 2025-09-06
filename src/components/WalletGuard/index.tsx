'use client';
import React from 'react';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Wallet, Lock } from 'lucide-react';

interface WalletGuardProps {
  children: React.ReactNode;
}

const WalletGuard: React.FC<WalletGuardProps> = ({ children }) => {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Lock className="w-12 h-12 text-blue-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700">
                  <Wallet className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">
                Connect Your Wallet
              </h2>
              
              <p className="text-gray-400 mb-8">
                Please connect your wallet to access Wefit365 and start your fitness journey
              </p>
              
              <button
                onClick={() => open()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
              
              <div className="mt-6 text-sm text-gray-500">
                Secure connection powered by WalletConnect
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WalletGuard;