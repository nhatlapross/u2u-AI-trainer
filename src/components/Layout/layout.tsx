'use client';
import { ReactNode, useEffect } from 'react';
import Navbar from '../Header/index';
import Footer from '../Footer/index';
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
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}