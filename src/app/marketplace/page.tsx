'use client';

import { lazy, Suspense } from 'react';

// Lazy load NFTMarketplace to improve initial loading performance
const NFTMarketplace = lazy(() => import('@/components/MarketPlace/nft-marketplace'));

const Home = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-orange-500">Loading Marketplace...</p>
                </div>
            </div>
        }>
            <NFTMarketplace />
        </Suspense>
    )
}

export default Home;