'use client';

import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { NextPage } from 'next';
import BlockchainFitnessLanding from "@/components/LandingPage/Landing";

const Home: NextPage = () => {
    const { setFrameReady, isFrameReady } = useMiniKit();

    useEffect(() => {
        if (!isFrameReady) setFrameReady();
    }, [isFrameReady, setFrameReady]);
    return (
        <div className="w-full">
            <BlockchainFitnessLanding />
        </div>
    );
}

export default Home;