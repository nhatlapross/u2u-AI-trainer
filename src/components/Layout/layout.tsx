'use client';
import { ReactNode, useEffect } from 'react';
import Navbar from '../Header/index';
import Footer from '../Footer/index';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}