'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'
import { Product } from './product-card'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { abi } from '@/abi/abi'

interface RedeemProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (nftTokenId: string) => void;
  product: Product | null;
}

export default function RedeemProductModal({
  isOpen,
  onClose,
  product,
  onRedeem
}: RedeemProductModalProps) {
  const { address } = useAccount()
  const [selectedNFT, setSelectedNFT] = useState<any>(null)
  const [nfts, setNFTs] = useState<any[]>([])

  // Fetch NFTs using useReadContract
  const {
    data: contractNftDetails,
    isLoading,
  } = useReadContract({
    abi: abi,
    address: process.env.NEXT_PUBLIC_WEFIT_NFT as `0x${string}`,
    functionName: 'getNFTDetailsByAddress',
    args: [address],
    query: {
      enabled: !!address && isOpen
    }
  })

  useEffect(() => {
    if (contractNftDetails && Array.isArray(contractNftDetails)) {
      const transformedNFTs = contractNftDetails.map((nft: any) => ({
        tokenId: nft.tokenId,
        name: nft.name,
        points: nft.points,
        level: nft.level,
        tokenUri: nft.tokenUri,
      }))
      setNFTs(transformedNFTs)
    }
  }, [contractNftDetails])

  const handleConfirmRedeem = () => {
    if (selectedNFT && product) {
      onRedeem(selectedNFT.tokenId)
      onClose()
    }
  }

  if (!product) return null

  const canRedeem = selectedNFT &&
    selectedNFT.points >= product.pointsRequired &&
    selectedNFT.level >= product.minLevel

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl text-black max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black text-center">
            Redeem Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="bg-white/40 p-4 rounded-xl border-2 border-black">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-black/70">{product.description}</p>
                <div className="flex gap-3 mt-1">
                  <p className="font-bold text-orange-600">⭐ {product.pointsRequired} points</p>
                  <p className="font-bold text-blue-600">🏆 Level {product.minLevel}+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Select NFT */}
          <div>
            <p className="font-semibold mb-2">Select NFT to use points from:</p>
            {isLoading ? (
              <div className="text-center py-4">Loading your NFTs...</div>
            ) : nfts.length === 0 ? (
              <div className="bg-white/40 p-4 rounded-xl border-2 border-black text-center">
                <p className="text-black/70">You don't have any NFTs yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {nfts.map((nft) => {
                  const hasEnoughPoints = nft.points >= product.pointsRequired
                  const hasEnoughLevel = nft.level >= product.minLevel
                  const canUse = hasEnoughPoints && hasEnoughLevel

                  let errorMessage = ''
                  if (!hasEnoughPoints && !hasEnoughLevel) {
                    errorMessage = 'Low points & level'
                  } else if (!hasEnoughPoints) {
                    errorMessage = 'Not enough points'
                  } else if (!hasEnoughLevel) {
                    errorMessage = `Need level ${product.minLevel}`
                  }

                  return (
                    <div
                      key={nft.tokenId.toString()}
                      onClick={() => canUse && setSelectedNFT(nft)}
                      className={`
                        p-3 rounded-xl border-2 border-black cursor-pointer transition-all
                        ${selectedNFT?.tokenId === nft.tokenId
                          ? 'bg-orange-500 text-white'
                          : canUse
                            ? 'bg-white/40 hover:bg-white/60'
                            : 'bg-gray-300 opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12">
                            <Image
                              src={nft.tokenUri}
                              alt={nft.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div>
                            <p className="font-bold">{nft.name}</p>
                            <p className="text-sm">🏆 Level {nft.level.toString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">⭐ {nft.points.toString()}</p>
                          {!canUse && (
                            <p className="text-xs text-red-600 font-semibold">{errorMessage}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-400 text-white font-bold rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black hover:bg-gray-500 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRedeem}
              disabled={!canRedeem}
              className={`flex-1 px-6 py-3 font-bold rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black transition-all duration-200 ${
                canRedeem
                  ? 'bg-green-500 text-white hover:bg-green-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              Confirm Redeem
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
