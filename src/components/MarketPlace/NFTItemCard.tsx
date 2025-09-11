import React, { memo } from 'react'

interface NFT {
    id: string;
    name: string;
    image: string;
    price: number | null;
    owner: string;
    level: number;
    days: number;
    points: number;
}

interface NFTItemCardProps {
    nft: NFT;
    onSell?: (nft: NFT) => void;
    onBuy?: (nft: NFT) => void;
    isMarket?: boolean;
}

const NFTItemCard = memo(({ nft, onSell, onBuy, isMarket = false }: NFTItemCardProps) => {
    return (
        <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
            <div className="flex space-x-4">
                {/* NFT Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-black bg-white flex-shrink-0">
                    <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-black truncate">
                            {nft.name}
                        </h3>
                        <div className={`border border-black text-white px-2 py-1 rounded-lg text-xs font-bold ${
                            isMarket ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                            {isMarket ? 'FOR SALE' : 'OWNED'}
                        </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-black/70">Level:</span>
                            <span className="font-medium text-black">{nft.level}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-black/70">Days:</span>
                            <span className="font-medium text-black">{nft.days}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-black/70">Points:</span>
                            <span className="font-medium text-black">{nft.points}</span>
                        </div>
                        {isMarket && nft.price && (
                            <div className="flex justify-between text-sm">
                                <span className="text-black/70">Price:</span>
                                <span className="font-bold text-green-600">{nft.price} ETH</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Action Button */}
                    {isMarket && onBuy ? (
                        <button
                            onClick={() => onBuy(nft)}
                            className="w-full bg-orange-500 border-t-2 border-l-2 border-r-4 border-b-4 border-black text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200"
                        >
                            Buy Now
                        </button>
                    ) : onSell && (
                        <button
                            onClick={() => onSell(nft)}
                            className="w-full bg-green-500 border-t-2 border-l-2 border-r-4 border-b-4 border-black text-white font-bold py-2 px-4 rounded-xl hover:bg-green-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200"
                        >
                            Sell NFT
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
})

NFTItemCard.displayName = 'NFTItemCard'

export default NFTItemCard