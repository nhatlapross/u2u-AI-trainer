'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { NextPage } from 'next';
import OnboardingTutorial from "@/components/LandingPage/Landing";

const Home: NextPage = () => {
    const { setFrameReady, isFrameReady } = useMiniKit();
    const router = useRouter();
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

    useEffect(() => {
        if (!isFrameReady) setFrameReady();
    }, [isFrameReady, setFrameReady]);

    useEffect(() => {
        // Check if onboarding was completed
        const completed = localStorage.getItem('hasCompletedOnboarding') === 'true';
        setHasCompletedOnboarding(completed);
        
        // If already completed, redirect to mint page
        if (completed) {
            router.push('/mint');
        }
    }, [router]);

    // Show loading while checking onboarding status
    if (hasCompletedOnboarding === null) {
        return null;
    }

    // Show onboarding if not completed
    if (!hasCompletedOnboarding) {
        return (
            <div className="w-full">
                <OnboardingTutorial />
            </div>
        );
    }

    // This shouldn't be reached due to redirect, but just in case
    return null;
}

export default Home;