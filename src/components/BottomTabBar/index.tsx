'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Dumbbell, Trophy, Store, User, Target, Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

const BottomTabBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Check onboarding status on mount and when pathname changes
    const completed = localStorage.getItem('hasCompletedOnboarding') === 'true';
    setHasCompletedOnboarding(completed);
  }, [pathname]);

  // Hide bottom tab bar during onboarding and on squat page
  if (pathname === '/' || pathname === '/squat' || hasCompletedOnboarding === false) {
    return null;
  }

  const tabs = [
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

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  return (
    <>
      {/* Wallet Menu Popup */}
      {showWalletMenu && (
        <div className="fixed bottom-20 right-4 bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl shadow-xl z-50 p-4 min-w-[240px]">
          <div className="flex flex-col space-y-3">
            <div className="text-sm text-black font-semibold">Connected Wallet</div>
            <div className="flex items-center gap-2">
              <div className="text-black font-mono text-sm flex-1 font-medium">
                {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
              </div>
              <button
                onClick={handleCopyAddress}
                className="p-1.5 rounded-lg hover:bg-black/10 transition-colors border border-black/20"
                title="Copy address"
              >
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-black" />
                )}
              </button>
            </div>
            {copied && (
              <div className="text-xs text-green-600 font-medium">Address copied!</div>
            )}
            <button
              onClick={handleDisconnect}
              className="flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 transition-colors py-2 px-4 rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black font-semibold"
            >
              <LogOut size={16} />
              <span className="text-sm">Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <div 
        className="bg-white px-4 py-2 shadow-lg border-t-2 border-black" 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          width: '100%',
          transform: 'translateZ(0)'
        }}
      >
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.path;
            
            return (
              <button
                key={tab.path}
                onClick={() => handleTabClick(tab.path)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 min-w-[60px] ${
                  isActive 
                    ? 'bg-orange-500 text-white border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon 
                  size={24} 
                  className="mb-1"
                />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
          
          {/* Wallet Button */}
          <button
            onClick={handleWalletClick}
            className="flex flex-col items-center justify-center p-2 text-gray-600 hover:text-gray-800 transition-colors min-w-[60px]"
          >
            <Wallet size={24} className="mb-1" />
            <span className="text-[10px] font-medium">Wallet</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default BottomTabBar;