'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Dumbbell, Trophy, Store, User, Target, Wallet, LogOut } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

const BottomTabBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const tabs = [
    { 
      icon: Home, 
      label: 'Home', 
      path: '/' 
    },
    { 
      icon: Target, 
      label: 'Mint', 
      path: '/mint' 
    },
    { 
      icon: Dumbbell, 
      label: 'Exercise', 
      path: '/mission' 
    },
    { 
      icon: Trophy, 
      label: 'Hackathon', 
      path: '/hackathon' 
    },
    { 
      icon: Store, 
      label: 'Market', 
      path: '/marketplace' 
    },
    { 
      icon: User, 
      label: 'Profile', 
      path: '/profile' 
    }
  ];

  const handleTabClick = (path: string) => {
    router.push(path);
    setShowWalletMenu(false);
  };

  const handleWalletClick = () => {
    setShowWalletMenu(!showWalletMenu);
  };

  const handleDisconnect = () => {
    localStorage.setItem("userNFT", '');
    localStorage.setItem("dayNFT", '');
    disconnect();
    setShowWalletMenu(false);
  };

  return (
    <>
      {/* Wallet Menu Popup */}
      {showWalletMenu && (
        <div className="fixed bottom-20 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-4 min-w-[200px]">
          <div className="flex flex-col space-y-3">
            <div className="text-sm text-gray-400">Connected Wallet</div>
            <div className="text-white font-mono text-sm">
              {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </div>
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} />
              <span className="text-sm">Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
        <div className="flex items-center h-16">
          {/* Navigation Tabs */}
          <div className="flex justify-around items-center flex-1 px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.path;
              
              return (
                <button
                  key={tab.path}
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
                    isActive 
                      ? 'text-blue-500' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={`mb-1 transition-transform duration-200 ${
                      isActive ? 'scale-110' : ''
                    }`}
                  />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 w-10 h-0.5 bg-blue-500 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Wallet Button */}
          <div className="border-l border-gray-700 px-3">
            <button
              onClick={handleWalletClick}
              className="flex flex-col items-center justify-center p-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <Wallet size={20} className="mb-1" />
              <span className="text-[10px] font-medium">Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomTabBar;