'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Zap, Trophy, Gift, Users, Hand } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Dynamic import framer-motion with proper types
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => {
    const MotionComponent = ({ children, ...props }: any) => {
      const { motion } = mod
      return <motion.div {...props}>{children}</motion.div>
    }
    return MotionComponent
  }),
  { ssr: false }
)

const AnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => mod.AnimatePresence),
  { ssr: false }
)

export default function OnboardingTutorial() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Boar!",
      description: "Start your fitness journey with blockchain rewards",
      icon: <Hand className="w-16 h-16 text-black" />,
      content: "Transform your fitness routine into an exciting game where every workout counts!"
    },
    {
      title: "Step 1: Mint Your NFT",
      description: "Create your unique fitness character",
      icon: <Zap className="w-16 h-16 text-black" />,
      content: "Choose your name and mint a unique NFT. Each NFT has different rarity levels that boost your bonus points!"
    },
    {
      title: "Step 2: Train Daily",
      description: "Work out with your NFT to earn points",
      icon: <Trophy className="w-16 h-16 text-black" />,
      content: "Select your NFT for daily workouts. Complete exercises to earn points and level up your character!"
    },
    {
      title: "Step 3: Earn Rewards",
      description: "Exchange points for amazing prizes",
      icon: <Gift className="w-16 h-16 text-black" />,
      content: "Use your earned points to redeem vouchers, discounts, and exclusive fitness gear!"
    },
    {
      title: "Step 4: Join Community",
      description: "Trade NFTs and compete in contests",
      icon: <Users className="w-16 h-16 text-black" />,
      content: "Sell your NFTs on the marketplace and participate in fitness challenges to win amazing prizes!"
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Mark onboarding as completed
      localStorage.setItem('hasCompletedOnboarding', 'true')
      router.push('/mint')
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTutorial = () => {
    // Mark onboarding as completed when skipping
    localStorage.setItem('hasCompletedOnboarding', 'true')
    router.push('/mint')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <MotionDiv
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-8 shadow-lg text-center"
          >
            {/* Progress bar */}
            <div className="flex justify-center mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-12 mx-1 rounded-full ${
                    index <= currentStep ? 'bg-black' : 'bg-black/20'
                  }`}
                />
              ))}
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              {steps[currentStep].icon}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-black mb-4">
              {steps[currentStep].title}
            </h1>

            {/* Description */}
            <p className="text-lg font-semibold text-black/80 mb-6">
              {steps[currentStep].description}
            </p>

            {/* Content */}
            <p className="text-black/70 text-base mb-8 max-w-lg mx-auto">
              {steps[currentStep].content}
            </p>

            {/* Navigation buttons */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center items-center gap-4">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                  className={`border-t-2 border-l-2 border-r-4 border-b-4 border-black text-black hover:bg-black hover:text-yellow-400 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200 ${
                    currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>

                <Button
                  onClick={nextStep}
                  variant="outline"
                  className="border-t-2 border-l-2 border-r-4 border-b-4 border-black text-black hover:bg-black hover:text-yellow-400 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2 transition-all duration-200"
                >
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={skipTutorial}
                variant="ghost"
                className="text-black/60 hover:text-black underline active:transform active:scale-95 transition-all duration-200"
              >
                Skip Tutorial
              </Button>
            </div>
          </MotionDiv>
        </AnimatePresence>
      </div>
    </div>
  )
}