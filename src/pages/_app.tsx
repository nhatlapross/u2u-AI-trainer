import { AppProps } from 'next/app';
import Layout from '../components/Layout/layout';
import 'tailwindcss/tailwind.css';
import Web3ModalProvider from '@/context'

import { MiniKitContextProvider } from '@/providers/MiniKitProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MiniKitContextProvider>
      <Web3ModalProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Web3ModalProvider>
    </MiniKitContextProvider>
  )
}