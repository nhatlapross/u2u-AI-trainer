"use client"
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useAccount, useWriteContract } from 'wagmi'
import { abi } from '@/abi/abi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { motion } from 'framer-motion'

// Lazy load heavy components that are used conditionally
const ConfettiEffect = dynamic(() => import("@/components/MintNFT/confetti-effect").then(mod => ({ default: mod.ConfettiEffect })), {
  ssr: false
})

interface AvatarImage {
  url: string;
  link: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export default function MintNFTPage() {
  const [isMinting, setIsMinting] = useState(false)
  const [nftName, setNftName] = useState('')
  // const [nftDescription, setNftDescription] = useState('')
  const [mintedNFT, setMintedNFT] = useState<AvatarImage | null>(null)
  const [avatarURL, setAvatarURL] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showMintForm, setShowMintForm] = useState(true)
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract()
  const router = useRouter();

  // Memoized array of avatar image paths to prevent re-creation on each render
  const avatarImages: AvatarImage[] = useMemo(() => [
    { url: '/avatar/bear1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmcxerZCr21F1zN97NifdYfJjpNay8vpf17wkt9E2a3Ngo", rarity: 'common' },
    { url: '/avatar/bear2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmNWTAK5M3GRx8R94NXsJA1n15GzkcrbmUA3t3gJyotNAw", rarity: 'rare' },
    { url: '/avatar/buffalo1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmPfxSoDiwQX3Kb6UyEahKdP3UnyqHB6bcgrDJrY61v67X", rarity: 'uncommon' },
    { url: '/avatar/buffalo2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmZ7C2jnE5T2WBRejhPExgitfwbQFpyVLo2zcXfamVpnbF", rarity: 'epic' },
    { url: '/avatar/cat1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmZiV2bBF5fkvSfuS7PQi17MYqgquW4JXHgJp8XkvH59G8", rarity: 'common' },
    { url: '/avatar/cat2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmRfDWaT8DmrrP2Vu4AQZfG88tdnS9VZ9vcusCUU4H68qc", rarity: 'rare' },
    { url: '/avatar/chicken1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmYPZtv8KwiXu41oiXb7j6pi4mh8j95v7pb7rwLuNQPD2P", rarity: 'uncommon' },
    { url: '/avatar/chicken2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmPUZfbL7XUZwooC1BtfLdfmnbbShiBS1dASC4duzc5Y6E", rarity: 'epic' },
    { url: '/avatar/pig1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmNdouP39erhzRaEwy3qQf6yH6P8qQdezuZkdg2JLQjoyz", rarity: 'common' },
    { url: '/avatar/pig2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmQybyAYpUHVjzTzAXJoJUm7MW7BdreDUims9Kmih2G4Lm", rarity: 'rare' },
    { url: '/avatar/tiger1.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmbnW2fdYPSiRAGSNu8JBUCJHjmy5rxSALmFEVQMwNSAWU", rarity: 'legendary' },
    { url: '/avatar/tiger2.png', link: "https://statutory-plum-seahorse.myfilebase.com/ipfs/QmcW93pTwXTRwjnnGF62ybNZuZnkFvpDLy1A9PPkZBcJ8p", rarity: 'legendary' },
  ], []);


  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setMintedNFT(null);
    setAvatarURL(null);
    setIsMinting(true);

    // Select a random avatar
    const randomImage = avatarImages[Math.floor(Math.random() * avatarImages.length)];

    // Update the state with the selected avatar
    setMintedNFT(randomImage);
    
    try {
      await writeContract({
        abi: abi,
        address: process.env.NEXT_PUBLIC_WEFIT_NFT as `0x${string}`,
        functionName: 'mintNFT',
        args: [nftName, address, randomImage.rarity, randomImage.link],
      });
    } catch (error) {
      console.error('Minting failed:', error);
      setIsMinting(false);
      
      // Check if user rejected the transaction
      if (error instanceof Error) {
        if (error.message.includes('User rejected') || error.message.includes('user rejected')) {
          toast.error('Transaction was cancelled by user');
          return;
        }
        
        if (error.message.includes('insufficient funds')) {
          toast.error('Insufficient funds for transaction');
          return;
        }
        
        // Generic error
        toast.error('Minting failed: ' + error.message);
      } else {
        toast.error('An unexpected error occurred during minting');
      }
      
      // Fallback to mock data for testing/offline mode
      console.log('Using mock data for testing');
      setTimeout(() => {
        // Save mock NFT data to localStorage
        const mockNFT = {
          name: nftName,
          image: randomImage.url,
          rarity: randomImage.rarity,
          link: randomImage.link,
          isMock: true,
          timestamp: Date.now()
        };
        
        localStorage.setItem('userNFT', JSON.stringify(mockNFT));
        localStorage.setItem('dayNFT', new Date().toISOString().split('T')[0]);
        
        // Set state to show success UI
        setAvatarURL(randomImage.url);
        setShowMintForm(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        
        toast.success('Demo NFT created! (Offline mode)');
      }, 1000);
    }
  };

  useEffect(() => {
    if (hash != null && isMinting && mintedNFT) {
      console.log('NFT minted successfully:', hash);
      
      // Save real NFT data to localStorage
      const realNFT = {
        name: nftName,
        image: mintedNFT.url,
        rarity: mintedNFT.rarity,
        link: mintedNFT.link,
        hash: hash,
        isMock: false,
        timestamp: Date.now()
      };
      
      localStorage.setItem('userNFT', JSON.stringify(realNFT));
      localStorage.setItem('dayNFT', new Date().toISOString().split('T')[0]);
      
      setAvatarURL(mintedNFT.url);
      setIsMinting(false);
      setShowMintForm(false);

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      toast.success(`NFT "${nftName}" minted successfully!`);
    }
  }, [hash, isMinting, mintedNFT, nftName]);

  const rarityColors: Record<AvatarImage['rarity'], string> = useMemo(() => ({
    common: "bg-gray-400 text-black",
    uncommon: "bg-green-400 text-black",
    rare: "bg-blue-400 text-white",
    epic: "bg-purple-500 text-white",
    legendary: "bg-yellow-400 text-black",
  }), []);

  const handleRetry = () => {
    setShowMintForm(true);
    setAvatarURL(null);
    setMintedNFT(null);
    setNftName('');
    setShowConfetti(false);
  };

  return (
    <>
      {/* Fullscreen Loading */}
      {isMinting && (
        <div className="fixed inset-0 bg-yellow-400 z-50 flex items-center justify-center">
          <div className="text-center">
            <Image
              src="/loading.gif"
              alt="Minting NFT..."
              width={400}
              height={300}
              className="mx-auto"
              unoptimized
            />
            <h2 className="text-3xl font-bold text-black mt-4">Minting Your NFT...</h2>
            <p className="text-black/80 text-lg">Please wait while we create your unique NFT</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-6 shadow-lg">
          
          {/* Mint Form */}
          {showMintForm && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-black mb-2">Mint Your NFT</h1>
                <p className="text-black/80">Enter a name for your new NFT and click mint!</p>
              </div>
              
              <form onSubmit={handleMint} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="nftName" className="text-sm font-semibold text-black">
                    NFT Name
                  </label>
                  <input
                    id="nftName"
                    type="text"
                    placeholder="Enter NFT name"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isMinting || !nftName.trim()}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 ${
                    isMinting || !nftName.trim()
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed border-2 border-gray-500'
                      : 'bg-orange-500 text-white hover:bg-orange-600 border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-lg hover:shadow-xl active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2'
                  }`}
                >
                  {isMinting ? 'Minting...' : 'Mint NFT'}
                </button>
              </form>
            </>
          )}
        
          {/* NFT Result */}
          {avatarURL && !showMintForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold mb-2 text-black">Congratulations!</h3>
              <p className="mb-4 text-black/80">Your NFT "{nftName}" has been minted successfully!</p>
              <div className="relative w-48 h-48 mx-auto border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl overflow-hidden bg-white mb-4">
                <Image
                  src={mintedNFT?.url || ''}
                  alt={`Minted NFT: ${nftName}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                {/* Rarity Badge */}
                {mintedNFT && (
                  <div
                    className={`absolute top-2 right-2 px-3 py-1 rounded-xl font-bold text-sm border-2 border-black ${
                      rarityColors[mintedNFT.rarity] || "bg-black text-white"
                    }`}
                  >
                    {mintedNFT.rarity.toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {((hash != null || avatarURL != null) && mintedNFT != null) && (
                  <Link
                    href={`https://sepolia.basescan.org/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-full bg-black text-yellow-400 hover:bg-gray-800 font-semibold py-3 px-4 rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black transition-all duration-200 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2">
                      View in Explorer
                    </button>
                  </Link>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push('/profile')}
                    className="bg-green-500 text-white hover:bg-green-600 font-bold py-3 px-4 rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-lg transition-all duration-200 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2"
                  >
                    Go to Profile
                  </button>
                  
                  <button
                    onClick={handleRetry}
                    className="bg-orange-500 text-white hover:bg-orange-600 font-bold py-3 px-4 rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-lg transition-all duration-200 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2"
                  >
                    Mint Another
                  </button>
                </div>
              </div>
            </motion.div>
          )}
      </div>
      {showConfetti && <ConfettiEffect />}
    </div>
    </>
  )
}