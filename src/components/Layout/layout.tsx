'use client';
import { ReactNode, useEffect } from 'react';
import BottomTabBar from '../BottomTabBar/index';
import WalletGuard from '../WalletGuard/index';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);
  
  return (
    <WalletGuard>
      <main className="pb-20">
        {children}
      </main>
      <BottomTabBar />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FDE047',
            color: '#000',
            border: '2px solid #000',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 16px'
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#000',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444', 
              secondary: '#000',
            },
          },
        }}
      />
    </WalletGuard>
  )
}