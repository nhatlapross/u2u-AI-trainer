'use client';

import NFTMarketplace from '@/components/MarketPlace/nft-marketplace';

const Home = () => {
    return (
        <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
            <div className="w-full px-10">
                <NFTMarketplace />
            </div>
        </div>
    )
}

export default Home;