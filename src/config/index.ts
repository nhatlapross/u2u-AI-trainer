import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { defineChain } from 'viem'

// Get projectId from https://cloud.walletconnect.com
export const projectId: string | undefined = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Define U2U Network Testnet
export const u2uTestnet = defineChain({
  id: 2484,
  name: 'U2U Network Testnet',
  nativeCurrency: {
    name: 'U2U',
    symbol: 'U2U',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-nebulas-testnet.uniultra.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'U2U Scan',
      url: 'https://testnet.u2uscan.xyz',
    },
  },
  testnet: true,
})

// Create wagmiConfig
const chains = [u2uTestnet] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})