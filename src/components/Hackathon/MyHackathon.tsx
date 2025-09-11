import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const hackathons = [
    {
        id: 1,
        name: "Squat Challenge Hackathon",
        type: "squat",
        startDate: "2024-07-15",
        endDate: "2024-07-22",
        participants: 120,
        maxParticipants: 200,
        price: 49.99,
        image: "/squatAI.png"
    },
    {
        id: 2,
        name: "Push-Up Power Weekend",
        type: "push up",
        startDate: "2024-08-05",
        endDate: "2024-08-07",
        participants: 85,
        maxParticipants: 150,
        price: 79.99,
        image: "/pushup.png"
    },
    {
        id: 3,
        name: "Jumping Jack Marathon",
        type: "jumping jack",
        startDate: "2024-09-10",
        endDate: "2024-09-17",
        participants: 60,
        maxParticipants: 100,
        price: 59.99,
        image: "/jumpingjack.png"
    },
    {
        id: 4,
        name: "Core Crunch Challenge",
        type: "curl crunch",
        startDate: "2024-10-01",
        endDate: "2024-10-08",
        participants: 95,
        maxParticipants: 180,
        price: 69.99,
        image: "/curlcrunch.png",
    }
];

export default function MyHackathon({ myNFTs }: { myNFTs: any[] }) {
    const handleClaim = (hackathon: any) => {
        // Implement claim logic here
        console.log(`Claiming hackathon: ${hackathon.name}`);
    };

    return (
        <div className="space-y-3">
            {myNFTs.length === 0 ? (
                <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-bold text-black mb-2">No Hackathon NFTs Yet</h3>
                    <p className="text-black/70 text-sm">Join a hackathon from the All Hackathon tab to get started!</p>
                </div>
            ) : (
                myNFTs.map((nft) => (
                    <div key={nft.nftId} className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
                        <div className="flex space-x-4">
                            {/* Image */}
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-black bg-white flex-shrink-0">
                                <img
                                    src={nft.image}
                                    alt={nft.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-black truncate">
                                        {nft.name}
                                    </h3>
                                    <div className="bg-green-500 border border-black text-white px-2 py-1 rounded-lg text-xs font-bold">
                                        OWNED
                                    </div>
                                </div>
                                
                                <div className="space-y-1 mb-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-black/70">Type:</span>
                                        <span className="font-medium text-black capitalize">{nft.type}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-black/70">NFT ID:</span>
                                        <span className="font-mono text-black text-xs">{nft.nftId}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-black/70">Claimed:</span>
                                        <span className="font-medium text-black text-xs">{nft.claimedAt}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-black/70">Value:</span>
                                        <span className="font-bold text-green-600">${nft.price}</span>
                                    </div>
                                </div>
                                
                                {/* Claim Button */}
                                <button
                                    onClick={() => handleClaim(nft)}
                                    className="w-full bg-orange-500 border-t-2 border-l-2 border-r-4 border-b-4 border-black text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200"
                                >
                                    Claim Rewards
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}