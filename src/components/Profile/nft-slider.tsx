"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { abi } from '@/abi/abi'

interface NFTSliderProps {
  onNFTUse: (nft: any) => void;
  nftDetails?: any;
  mockNFT?: any;
}

export default function NFTSlider({ onNFTUse, nftDetails, mockNFT }: NFTSliderProps) {
  // State to hold NFTs with default empty array
  const [nfts, setNFTs] = useState<any[]>([])
  const [selectedNFT, setSelectedNFT] = useState<any>(null)
  
  const { address } = useAccount()

  // Fetch NFTs using useReadContract
  const { 
    data: contractNftDetails, 
    isLoading, 
    error, 
    refetch: refetchNFTDetails 
  } = useReadContract({
    abi: abi,
    address: process.env.NEXT_PUBLIC_WEFIT_NFT as `0x${string}`,
    functionName: 'getNFTDetailsByAddress',
    args: [address],
    query: {
      enabled: !!address
    }
  })

  // Use prop data if available, otherwise use contract data
  const activeNftDetails = nftDetails || contractNftDetails

  // Transform contract NFT data to component's NFT interface
  useEffect(() => {
    const nftList = [];
    
    // Add mock NFT if exists
    if (mockNFT) {
      nftList.push({
        tokenId: 'MOCK-' + (mockNFT.timestamp || Date.now()),
        lastUpdateDay: 1,
        level: 1,
        name: mockNFT.name || 'Mock NFT',
        points: 100,
        rarity: mockNFT.rarity || 'common',
        tokenUri: mockNFT.image || mockNFT.link,
        isUsing: true,
        isSelling: false,
        isMock: true
      });
    }
    
    // Add real NFTs from contract
    if (activeNftDetails && Array.isArray(activeNftDetails)) {
      const transformedNFTs = activeNftDetails.map((nft: any) => ({
        tokenId: nft.tokenId,
        lastUpdateDay: nft.lastUpdateDay,
        level: nft.level,
        name: nft.name,
        points: nft.points,
        rarity: nft.rarity,
        tokenUri: nft.tokenUri,
        isUsing: false,
        isSelling: false,
        isMock: false
      }))
      
      nftList.push(...transformedNFTs);
    }
    
    setNFTs(nftList);
  }, [activeNftDetails, mockNFT])

  const handleNFTClick = (nft: any) => {
    if (!nft.isSelling) {
      setSelectedNFT(nft)
    }
  }

  const handleCloseModal = () => {
    setSelectedNFT(null)
  }

  const handleUseNFT = () => {
    if (!selectedNFT) return

    const updatedNFTs = nfts.map(nft => {
      if (nft.tokenId === selectedNFT.tokenId) {
        return { 
          ...nft, 
          isUsing: !nft.isUsing,
          isSelling: false
        }
      }
      return { 
        ...nft, 
        isUsing: false,
        isSelling: false
      }
    })
    
    const usedNFT = updatedNFTs.find(nft => nft.tokenId === selectedNFT.tokenId && nft.isUsing)
    
    setNFTs(updatedNFTs)
    onNFTUse && onNFTUse(usedNFT || null)
    handleCloseModal()
  }

  // Render loading or error states
  if (isLoading) return <div>Loading NFTs...</div>
  if (error) return <div>Error loading NFTs: {error.message}</div>

  return (
    <>
      <Carousel className="w-full max-w-xs mx-auto relative">
        <CarouselContent>
          {nfts.map((nft) => (
            <CarouselItem key={nft.tokenId}>
              <Card>
                <CardContent 
                  className={`
                    flex aspect-square items-center justify-center p-6 relative 
                    cursor-pointer
                    transition-colors duration-200
                    ${nft.isUsing ? "border-2 border-green-500" : ""}
                    ${nft.isSelling ? "opacity-50" : ""}
                  `}
                  onClick={() => handleNFTClick(nft)}
                >
                <div className="text-center">
                  <div className="relative">
                    <Image
                      src={nft.tokenUri}
                      alt={nft.name}
                      width={150}
                      height={150}
                      className="mx-auto mb-2 rounded-lg"
                    />
                    {nft.isUsing && (
                      <Badge 
                        variant="default" 
                        className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4"
                      >
                        Using
                      </Badge>
                    )}
                    {nft.isSelling && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4"
                      >
                        Selling
                      </Badge>
                    )}
                    {nft.isMock && (
                      <Badge 
                        variant="outline" 
                        className="absolute bottom-0 left-0 bg-yellow-500/20 text-yellow-500 border-yellow-500"
                      >
                        Offline
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold">{nft.name}</h4>
                  {nft.isSelling && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Implement cancel sell logic
                      }}
                    >
                      Cancel Sell
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black hover:bg-yellow-500 text-black w-8 h-8" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black hover:bg-yellow-500 text-black w-8 h-8" />
      </Carousel>

      {selectedNFT && !selectedNFT.isSelling && (
        <Dialog open={!!selectedNFT} onOpenChange={handleCloseModal}>
          <DialogContent className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl text-black max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-black text-center mb-4">
                {selectedNFT.name}
                {selectedNFT.isMock && (
                  <span className="ml-2 text-sm text-orange-600">(Offline Mode)</span>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center">
              <div className="mb-6">
                <Image
                  src={selectedNFT.tokenUri}
                  alt={selectedNFT.name}
                  width={120}
                  height={120}
                  className="mx-auto rounded-xl border-2 border-black object-cover"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                <div className="bg-white/20 p-3 rounded-lg border-2 border-black">
                  <p className="text-xs font-semibold text-black/60 uppercase">Token ID</p>
                  <p className="font-bold text-black">{selectedNFT.tokenId.toString()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg border-2 border-black">
                  <p className="text-xs font-semibold text-black/60 uppercase">Level</p>
                  <p className="font-bold text-black">{selectedNFT.level.toString()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg border-2 border-black">
                  <p className="text-xs font-semibold text-black/60 uppercase">Points</p>
                  <p className="font-bold text-black">{selectedNFT.points.toString()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg border-2 border-black">
                  <p className="text-xs font-semibold text-black/60 uppercase">Rarity</p>
                  <p className="font-bold text-black capitalize">{selectedNFT.rarity}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleUseNFT}
                  className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black hover:bg-blue-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200"
                >
                  {selectedNFT.isUsing ? "Unuse NFT" : "Use NFT"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}