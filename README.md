# Boar Fit - AI Fitness Trainer

Your personal AI fitness trainer that creates customized workout plans and provides real-time feedback to help you achieve your fitness goals.

![Hero Image](https://boar-fit.vercel.app/hero.png)

## 🌟 Features

- **AI-Powered Pose Detection**: Real-time squat tracking using MediaPipe and TensorFlow.js
- **Blockchain Integration**: NFT rewards on U2U Network (Mainnet) for completing workouts
- **Interactive Missions**: Complete fitness challenges and earn rewards
- **NFT Marketplace**: Trade and collect fitness achievement NFTs
- **Personalized Profile**: Track your progress and showcase your achievements
- **Tutorial System**: Step-by-step onboarding for new users

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **AI/ML**: TensorFlow.js, MediaPipe Pose Detection
- **Blockchain**: U2U Network (Mainnet), Wagmi, Web3Modal, OnchainKit
- **Styling**: Tailwind CSS, Framer Motion, Radix UI
- **State Management**: React Query, Context API

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/u2u-AI-trainer.git
cd u2u-AI-trainer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_WEFIT_NFT=your_nft_contract_address
NEXT_PUBLIC_SCAN_URL=https://u2uscan.xyz/tx
NEXT_PUBLIC_URL=your_app_url
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How It Works

1. **Connect Your Wallet**: Link your Web3 wallet to the app
2. **Complete Tutorial**: Learn the basics of squat form
3. **Start Training**: Use your camera for AI-powered pose detection
4. **Earn Rewards**: Complete squats correctly to earn points
5. **Mint NFTs**: Convert your achievements into unique NFTs
6. **Trade & Collect**: Use the marketplace to trade NFTs with other users

## 🏗️ Project Structure

```
u2u-AI-trainer/
├── src/
│   ├── app/              # Next.js app pages
│   ├── components/       # React components
│   ├── abi/             # Smart contract ABIs
│   ├── config/          # Configuration files
│   ├── context/         # React context providers
│   ├── data/            # Static data
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── .env                 # Environment variables
```

## 🔗 Blockchain Integration

This app integrates with the **U2U Network Mainnet**:
- Chain ID: 39
- Network: U2U Solaris Mainnet
- RPC: https://rpc-mainnet.uniultra.xyz
- Explorer: https://u2uscan.xyz
- **Contract Address**: [0xFa0EeA22012ceAE7188547995f4c8cfC2F233ba7](https://u2uscan.xyz/address/0xFa0EeA22012ceAE7188547995f4c8cfC2F233ba7)

Smart contracts handle:
- NFT minting for workout achievements
- Marketplace transactions
- Reward distribution

## 🎯 Key Components

- **SquatCounter** (`src/components/SquatCounter.tsx`): AI-powered squat detection and counting
- **MintNFT** (`src/components/MintNFT/MintNFT.tsx`): NFT minting interface
- **NFT Marketplace** (`src/components/MarketPlace/nft-marketplace.tsx`): Buy, sell, and trade NFTs
- **Profile** (`src/components/Profile/index.tsx`): User stats and NFT collection

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Live App**: [boar-fit.vercel.app](https://boar-fit.vercel.app)
- **U2U Network**: [u2u.xyz](https://u2u.xyz)
- **Documentation**: [docs](https://github.com/yourusername/u2u-AI-trainer/wiki)


## 💪 About

Boar Fit combines cutting-edge AI technology with blockchain to create a gamified fitness experience. Train smarter, earn rewards, and join a community of fitness enthusiasts!

---

Built with ❤️ using U2U Network 
