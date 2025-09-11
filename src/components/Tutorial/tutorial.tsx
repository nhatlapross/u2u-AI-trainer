import { useRouter } from 'next/navigation'
import { ArrowLeft, Play } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function SquatTutorial() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="flex items-center p-4 bg-white">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-full border-2 border-black bg-white shadow-md hover:bg-gray-50"
        >
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Title */}
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-center text-black">
          AI-Powered<br />
          Squat Tutorial
        </h1>
      </div>

      {/* Video/Image Section */}
      <div className="px-6 mb-8">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <div className="relative w-full h-56">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/m25_ftb7Mls" 
              title="AI-Powered Squat Tutorial"
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24">
        <h2 className="text-lg font-bold mb-4">About This Tutorial</h2>
        <p className="text-gray-700 mb-6 leading-relaxed text-sm">
          This video tutorial demonstrates how artificial intelligence can be used to analyze and improve your 
          squat form. AI technology can provide real-time feedback on your posture, depth, and overall 
          technique, helping you maximize the effectiveness of your workouts while minimizing the risk of injury.
        </p>

        <h3 className="text-lg font-bold mb-4">Key Points</h3>
        <ul className="space-y-3 mb-8">
          <li className="flex items-start text-black">
            <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Understanding proper squat form
          </li>
          <li className="flex items-start text-black">
            <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
            How AI tracks your movements
          </li>
          <li className="flex items-start text-black">
            <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Real-time feedback and corrections
          </li>
          <li className="flex items-start text-black">
            <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Tracking progress over time
          </li>
        </ul>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-24 left-4 right-4 z-[10000]">
        <Button 
          onClick={() => router.push('/squat')} 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-full text-lg border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-lg"
        >
          <Play className="w-5 h-5 mr-2 fill-current" />
          Let's Do Exercise
        </Button>
      </div>
    </div>
  )
}