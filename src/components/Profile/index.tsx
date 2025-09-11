import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress";
import NFTSlider from "./nft-slider"
import { Dumbbell, Flame, Coins, PersonStanding, PackageOpen } from 'lucide-react'
import { DollarSign } from 'lucide-react'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { abi } from '@/abi/abi'
import { Skeleton } from "@/components/ui/skeleton";

// Default fallback profile in case no NFT details are available
const defaultProfile = {
  avatar: "/avatar/buffalo1.png",
  title: "Cardano Fitness Enthusiast",
  subtitle: "Pushing limits, one block at a time.",
  description: "Blockchain developer by day, fitness junkie by night. Leveraging Cardano for a healthier future."
}

interface UserStats {
  level: number;
  points: number;
  lastUpdateDay: number;
  currentNFT: any;
  name?: string;
  rarity?: string;
  tokenUri?: string;
  tokenId?: any;
}

export default function ProfilePage() {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 10,
    points: 1567,
    lastUpdateDay: 68,
    currentNFT: null
  })

  const [myBalance, SetMyBalance] = useState<string | number>(0);
  const [currentProfile, setCurrentProfile] = useState(defaultProfile);
  const [isNFTSelected, setIsNFTSelected] = useState(false);
  const [mockNFT, setMockNFT] = useState<any>(null);
  const { address } = useAccount()

  const { data: balance } = useBalance({
    address: address
  })

  useEffect(() => {
    const formattedBalance = balance?.formatted ? parseFloat(balance.formatted).toFixed(6) : '0.000000'
    SetMyBalance(formattedBalance)
  }, [balance])

  const { data: nftDetails, isLoading, error } = useReadContract({
    abi: abi,
    address: process.env.NEXT_PUBLIC_WEFIT_NFT as `0x${string}`,
    functionName: 'getNFTDetailsByAddress',
    args: [address],
    query: {
      enabled: !!address
    }
  })

  const handleNFTUse = (nft: any) => {
    if (nft) {
      setUserStats({
        name: nft.name.toString() || '',
        level: nft.level.toString() || 0,
        points: nft.points.toString() || 0,
        rarity: nft.rarity|| '',
        lastUpdateDay: nft.lastUpdateDay.toString() || 0,
        tokenUri: nft.tokenUri.toString()|| '',
        tokenId: nft.tokenId,
        currentNFT: nft
      })
      setIsNFTSelected(true)
      localStorage.setItem("userNFT",nft.tokenId.toString());
      localStorage.setItem("dayNFT",nft.lastUpdateDay.toString());
    } else {
      setUserStats({
        name: 'unknown',
        level: 0,
        points: 0,
        rarity: '',
        lastUpdateDay: 0,
        tokenUri: undefined,
        currentNFT: null
      })
      setIsNFTSelected(false)
    }
  }

  // Check for mock NFT from localStorage
  useEffect(() => {
    const storedNFT = localStorage.getItem("userNFT");
    if (storedNFT) {
      try {
        const nftData = JSON.parse(storedNFT);
        if (nftData.isMock) {
          // Use mock NFT data
          setMockNFT(nftData);
          setUserStats({
            name: nftData.name || 'Mock NFT',
            level: 1,
            points: 100,
            rarity: nftData.rarity || 'common',
            lastUpdateDay: 1,
            tokenUri: nftData.image || nftData.link,
            tokenId: 'MOCK-' + Date.now(),
            currentNFT: nftData
          });
          setIsNFTSelected(true);
        }
      } catch (e) {
        // Handle old format or parsing errors
        console.log('Using old NFT format or parsing failed');
      }
    }
  }, []);

  // If nftDetails are loaded and contain a usable NFT, use the first one
  useEffect(() => {
    if (nftDetails && Array.isArray(nftDetails) && nftDetails.length > 0) {
      const usingNFT = nftDetails.find((nft: any) => nft.isUsing);
      if (usingNFT) {
        handleNFTUse(usingNFT);
        setMockNFT(null); // Clear mock NFT if real NFT exists
      }

      const nft = localStorage.getItem("userNFT");
      console.log(nft);
      
      if(nft != null && nft != '') {
        try {
          const nftData = JSON.parse(nft);
          if (!nftData.isMock) {
            // Only use real NFT from contract
            console.log(nftDetails)
            const foundNFT = nftDetails.find((x: any) => x.tokenId.toString() == nft.toString());
            if (foundNFT) {
              handleNFTUse(foundNFT);
              setIsNFTSelected(true);
              setMockNFT(null);
            }
          }
        } catch {
          // Old format - try to find by ID
          const foundNFT = nftDetails.find((x: any) => x.tokenId.toString() == nft.toString());
          if (foundNFT) {
            handleNFTUse(foundNFT);
            setIsNFTSelected(true);
            setMockNFT(null);
          }
        }
      }
    }
  }, [nftDetails])

  if (!address) {
    return (
      <div className="h-screen overflow-y-auto bg-gradient-to-br from-orange-600 via-red-600 to-orange-800 p-2">
        <div className="max-w-md mx-auto space-y-3">
          {/* Balance Card */}
          <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-black" />
                <div>
                  <h3 className="text-lg font-bold text-black">ETH Balance</h3>
                  <p className="text-black/70 text-xs">Base Sepolia Testnet</p>
                </div>
              </div>
              <div className="text-xl font-bold text-black">0.00</div>
            </div>
          </div>

          <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-black mb-2">Connect Your Wallet</h2>
              <p className="text-black/80 text-sm">Please connect your wallet to view your profile</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If address exists but no NFT selected
  if (!isNFTSelected) {
    return (
      <div className="h-screen overflow-y-auto bg-gradient-to-br from-orange-600 via-red-600 to-orange-800 p-2">
        <div className="max-w-md mx-auto space-y-3">
          {/* Balance Card */}
          <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-black" />
                <div>
                  <h3 className="text-lg font-bold text-black">ETH Balance</h3>
                  <p className="text-black/70 text-xs">Base Sepolia Testnet</p>
                </div>
              </div>
              <div className="text-xl font-bold text-black">{myBalance}</div>
            </div>
          </div>

          <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
            <div className="text-center mb-3">
              <h2 className="text-xl font-bold text-black mb-1">Select Your NFT</h2>
              <p className="text-black/80 text-sm">Choose an NFT to personalize your fitness profile</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-3">
              <PackageOpen className="w-12 h-12 text-black/60" />
              <p className="text-center text-black/70 text-sm px-2">
                You haven't selected an NFT yet. Browse your collection and choose one to get started!
              </p>
              <NFTSlider
                onNFTUse={handleNFTUse}
                nftDetails={nftDetails}
                mockNFT={mockNFT}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-orange-600 via-red-600 to-orange-800 p-2">
      <div className="max-w-md mx-auto space-y-3">
        {/* Balance Card */}
        <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-6 h-6 text-black" />
              <div>
                <h3 className="text-lg font-bold text-black">ETH Balance</h3>
                <p className="text-black/70 text-xs">Base Sepolia Testnet</p>
              </div>
            </div>
            <div className="text-xl font-bold text-black">{myBalance}</div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-black bg-white flex-shrink-0">
              <img
                src={userStats.tokenUri}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-black truncate">
                {userStats.name}
                {mockNFT && (
                  <span className="ml-1 text-xs text-orange-600">(Offline)</span>
                )}
              </h2>
              <p className="text-black/80 capitalize text-sm">{userStats.rarity}</p>
              {mockNFT && (
                <p className="text-xs text-black/60 mt-1 leading-tight">NFT will be synced when connection is restored</p>
              )}
            </div>
          </div>
        </div>

        {/* Fitness Activity Card */}
        <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
          <h3 className="text-lg font-bold text-black mb-3">Fitness Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PersonStanding className="text-orange-600 w-4 h-4" />
                <span className="text-black font-medium text-sm">Level</span>
              </div>
              <span className="font-bold text-black text-sm">{userStats.level}</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{width: '82%'}}></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="text-red-600 w-4 h-4" />
                <span className="text-black font-medium text-sm">Calories Burned</span>
              </div>
              <span className="font-bold text-black text-sm">{userStats.points.toString()} kcal</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Dumbbell className="text-green-600 w-4 h-4" />
                <span className="text-black font-medium text-sm">Workouts Completed</span>
              </div>
              <span className="font-bold text-black text-sm">{userStats.lastUpdateDay.toString()} days</span>
            </div>
          </div>
        </div>

        {/* NFT Collection Card */}
        <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
          <h3 className="text-lg font-bold text-black mb-3">NFT Collection</h3>
          <NFTSlider
            onNFTUse={handleNFTUse}
            nftDetails={nftDetails}
            mockNFT={mockNFT}
          />
        </div>
      </div>
    </div>
  )
}