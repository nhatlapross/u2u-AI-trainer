'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SellNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetPrice: (price: number) => void;
  nft: { 
    image: string; 
    name: string; 
    id: string;
    [key: string]: any;
  };
}
export default function SellNFTModal({ isOpen, onClose, onSetPrice, nft }: SellNFTModalProps) {
  const [price, setPrice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const numPrice = parseFloat(price)
    if (!isNaN(numPrice) && numPrice > 0) {
      setIsLoading(true)
      
      // Simulate transaction processing delay
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      onSetPrice(numPrice)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl text-black max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black text-center mb-4">Sell NFT</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-32 h-32 rounded-xl border-2 border-black overflow-hidden bg-white">
              <Image 
                src={nft.image} 
                alt={nft.name} 
                width={128} 
                height={128} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-black mb-1">{nft.name}</h3>
            <p className="text-sm text-black/70">ID: {nft.id}</p>
          </div>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent mb-4"></div>
              <p className="text-black/80 text-lg font-semibold">Creating Listing...</p>
              <p className="text-black/60 text-sm">Please wait while we process your listing</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-semibold text-black">
                  Set Price (ETH)
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price in ETH"
                  className="w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="flex gap-3 justify-center mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-500 text-white font-bold rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black hover:bg-gray-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black hover:bg-orange-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200"
                >
                  Set Price
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
