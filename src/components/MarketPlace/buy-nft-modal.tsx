import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface BuyNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuy: () => void;
  nft: {
    name: string;
    price: number | null;
    [key: string]: any;
  };
}

export default function BuyNFTModal({ isOpen, onClose, onBuy, nft }: BuyNFTModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBuy = async () => {
    setIsLoading(true)
    
    // Simulate transaction processing delay
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    onBuy()
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl text-black max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black text-center mb-4">Buy NFT</DialogTitle>
        </DialogHeader>
        <div className="py-6 text-center">
          <div className="mb-4">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-32 h-32 mx-auto rounded-xl border-2 border-black object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-black mb-2">{nft.name}</h3>
          {isLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent mb-4"></div>
              <p className="text-black/80 text-lg font-semibold">Processing Transaction...</p>
              <p className="text-black/60 text-sm">Please wait while we confirm your purchase</p>
            </div>
          ) : (
            <p className="text-black/80 text-lg mb-6">
              Are you sure you want to buy this NFT for <span className="font-bold text-green-600">{nft.price} ETH</span>?
            </p>
          )}
        </div>
        {!isLoading && (
          <DialogFooter className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white font-bold rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black hover:bg-gray-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleBuy}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black hover:bg-green-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200"
            >
              Confirm Purchase
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

