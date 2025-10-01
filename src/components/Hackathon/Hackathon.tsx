import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyHackathon from './MyHackathon';
import AllHackathon from './AllHackathon';

const FitnessHackathonSlider = () => {
    const [activeTab, setActiveTab] = useState('market');
    const [myNFTs, setMyNFTs] = useState<any[]>([]);

    const handleJoinHackathon = (hackathon: any) => {
        // Generate a unique NFT for the joined hackathon
        const newNFT = {
            ...hackathon,
            nftId: `NFT-${hackathon.id}-${Date.now()}`,
            claimedAt: new Date().toLocaleString()
        };

        // Add the new NFT to the collection
        setMyNFTs((prevNFTs: any[]) => [...prevNFTs, newNFT]);

        // Switch to My Hackathon tab
        setActiveTab('my-nfts');
    };

    return (
        <div className="h-screen overflow-y-auto bg-gradient-to-br from-orange-600 via-red-600 to-orange-800">
            <div className="max-w-md mx-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="sticky top-0 z-10 grid grid-cols-2 bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-3 mt-2 mb-4 w-full gap-2 h-14">
                        <TabsTrigger
                            value="market"
                            className={`
                                px-3 py-3 text-sm font-bold rounded-xl transition-all duration-200 flex-1 min-w-0
                                ${activeTab === 'market'
                                    ? 'bg-orange-500 text-white border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-md'
                                    : 'text-black hover:bg-yellow-300'}
                            `}
                        >
                            <span className="truncate">All Hackathon</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="my-nfts"
                            className={`
                                px-3 py-3 text-sm font-bold rounded-xl transition-all duration-200 flex-1 min-w-0
                                ${activeTab === 'my-nfts'
                                    ? 'bg-orange-500 text-white border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-md'
                                    : 'text-black hover:bg-yellow-300'}
                            `}
                        >
                            <span className="truncate">My Hackathon</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="market" className="px-2 pb-3">
                        <AllHackathon onJoinHackathon={handleJoinHackathon} />
                    </TabsContent>
                    <TabsContent value="my-nfts" className="px-2 pb-3">
                        <MyHackathon myNFTs={myNFTs} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default FitnessHackathonSlider;