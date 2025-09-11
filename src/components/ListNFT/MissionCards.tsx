"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Mission {
  title: string;
  description: string;
  image: string;
  isLocked: boolean;
  correct: number;
  maxTurn: number;
}

export default function MissionCards() {
  const router = useRouter()
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const missions = [
    {
      title: "Squat Mission",
      description: "Build lower body strength",
      image: "/squatAI.png",
      isLocked: false,
      correct: 5,
      maxTurn: 50,
    },
    {
      title: "Push Up Mission",
      description: "Strengthen your upper body",
      image: "/pushup.png",
      isLocked: true,
      correct: 10,
      maxTurn: 50,
    },
    {
      title: "Jumping Jack Mission",
      description: "Boost your cardio",
      image: "/jumpingjack.png",
      isLocked: true,
      correct: 20,
      maxTurn: 50,
    },
    {
      title: "Curl Crunch Mission",
      description: "Target your core muscles",
      image: "/curlcrunch.png",
      isLocked: true,
      correct: 30,
      maxTurn: 50,
    }
  ]

  const handleMissionClick = (mission: Mission) => {
    if (!mission.isLocked) {
      setSelectedMission(mission)
      setIsModalOpen(true)
    }
  }

  const handleTutorial = () => {
    if (selectedMission) {
      // Navigate to tutorial page for the specific mission
      router.push(`/tutorial`)
    }
  }

  const handleExercise = () => {
    if (selectedMission) {
      // Navigate to exercise page for the specific mission
      router.push(`/squat`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-800 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">Challenges</h1>
        <div className="space-y-4">
          {missions.map((mission, index) => (
            <button
              key={index}
              className={`w-full p-0 ${mission.isLocked ? 'cursor-not-allowed' : 'hover:scale-[1.02] transition-transform'}`}
              onClick={() => handleMissionClick(mission)}
            >
              <div className={`bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-4 flex items-center space-x-4 ${
                mission.isLocked ? 'opacity-60' : ''
              }`}>
                {/* Exercise Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-black bg-white flex-shrink-0">
                  <img
                    src={mission.image}
                    alt={mission.title}
                    className={`w-full h-full object-cover ${mission.isLocked ? "filter grayscale" : ""}`}
                  />
                </div>
                
                {/* Mission Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-black">{mission.title}</h3>
                    {mission.isLocked && (
                      <Lock className="w-4 h-4 text-black/60" />
                    )}
                  </div>
                  <p className="text-black/70 text-sm mb-1">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-black font-semibold text-sm">
                      {mission.correct} {mission.title.includes('Squat') ? 'squat' : 'reps'}
                    </span>
                    <span className="text-black/70 text-sm">
                      {mission.title.includes('Squat') ? '30 mins' : '25 mins'}
                    </span>
                    <span className="text-black font-semibold text-sm">
                      {mission.maxTurn * 8} kcal
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-black/20 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        mission.isLocked ? 'bg-gray-500' : index === 0 ? 'bg-orange-500' : 'bg-gray-400'
                      }`} 
                      style={{ width: mission.isLocked ? '0%' : index === 0 ? '80%' : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mission Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-black text-xl font-bold">{selectedMission?.title}</DialogTitle>
            <DialogDescription className="text-black/80">
              Choose how you want to proceed with this mission
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <button 
              onClick={handleTutorial}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black transition-colors"
            >
              View Tutorial
            </button>
            <button 
              onClick={handleExercise}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black transition-colors"
            >
              Start Exercise
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}