'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { NextPage } from 'next';

// Lazy load OnboardingTutorial to improve initial loading
const OnboardingTutorial = lazy(() => import("@/components/LandingPage/Landing"));

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
                <Suspense fallback={
                    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-800">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                            <p className="text-yellow-400 font-bold">Loading Tutorial...</p>
                        </div>
                    </div>
                }>
                    <OnboardingTutorial />
                </Suspense>
            </div>
        );
    }

    // This shouldn't be reached due to redirect, but just in case
    return null;
}

export default Home;