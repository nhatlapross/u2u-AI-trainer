'use client';
import { ReactNode, useEffect } from 'react';
import BottomTabBar from '../BottomTabBar/index';
import WalletGuard from '../WalletGuard/index';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

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
      <main className="pb-16">
        {children}
      </main>
      <BottomTabBar />
    </WalletGuard>
  )
}