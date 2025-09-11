import React, { useState } from 'react';
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

export default function AllHackathon({ onJoinHackathon }: { onJoinHackathon: (hackathon: any) => void }) {
    const [joinedHackathons, setJoinedHackathons] = useState<{[key: number]: any}>({});
    const [loadingStates, setLoadingStates] = useState<{[key: number]: boolean}>({});

    const handleJoinHackathon = (hackathon: any) => {
        // Set loading state for this specific hackathon
        setLoadingStates(prev => ({
            ...prev,
            [hackathon.id]: true
        }));

        // Simulate API call or blockchain transaction
        setTimeout(() => {
            // Update joined hackathons state
            setJoinedHackathons(prev => ({
                ...prev,
                [hackathon.id]: {
                    ...hackathon,
                    joinedAt: new Date().toLocaleString()
                }
            }));

            // Remove loading state
            setLoadingStates(prev => ({
                ...prev,
                [hackathon.id]: false
            }));

            // Call the parent component's join handler to generate NFT
            onJoinHackathon(hackathon);
        }, 2000); // Simulated 2-second loading
    };

    return (
        <div className="space-y-3">
            {hackathons.map((hackathon) => (
                <div key={hackathon.id} className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4">
                    <div className="flex space-x-4">
                        {/* Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-black bg-white flex-shrink-0">
                            <img
                                src={hackathon.image}
                                alt={hackathon.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-black truncate mb-2">
                                {hackathon.name}
                            </h3>
                            
                            <div className="space-y-1 mb-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-black/70">Type:</span>
                                    <span className="font-medium text-black capitalize">{hackathon.type}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-black/70">Duration:</span>
                                    <span className="font-medium text-black text-xs">
                                        {new Date(hackathon.startDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - {new Date(hackathon.endDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-black/70">Participants:</span>
                                    <span className="font-medium text-black">
                                        {hackathon.participants}/{hackathon.maxParticipants}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-black/70">Price:</span>
                                    <span className="font-bold text-green-600">${hackathon.price}</span>
                                </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-black/20 rounded-full h-2 mb-3">
                                <div 
                                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                    style={{width: `${(hackathon.participants / hackathon.maxParticipants) * 100}%`}}
                                ></div>
                            </div>
                            
                            {/* Join Button */}
                            {joinedHackathons[hackathon.id] ? (
                                <div className="bg-green-500 border-t-2 border-l-2 border-r-4 border-b-4 border-black text-white py-2 px-4 rounded-xl text-center">
                                    <p className="font-bold text-sm">Joined Successfully!</p>
                                    <p className="text-xs opacity-90">
                                        {joinedHackathons[hackathon.id].joinedAt}
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleJoinHackathon(hackathon)}
                                    disabled={loadingStates[hackathon.id]}
                                    className={`w-full font-bold py-2 px-4 rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black transition-all duration-200 ${
                                        loadingStates[hackathon.id] 
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                            : 'bg-orange-500 text-white hover:bg-orange-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2'
                                    }`}
                                >
                                    {loadingStates[hackathon.id] ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-gray-600 border-t-2 border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Joining...
                                        </div>
                                    ) : (
                                        'Join Hackathon'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}