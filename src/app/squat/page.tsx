'use client';

import React, { useState, useRef, useEffect } from "react";
import dynamic from 'next/dynamic';
import { X, RotateCcw, Play, Pause, CheckCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAccount, useWriteContract } from 'wagmi';
import { abi } from '@/abi/abi';

// Safely check for browser environment
const isBrowser = typeof window !== 'undefined';

interface Point {
  x: number;
  y: number;
}

const findAngle = (p1: Point, p2: Point, p3: Point): number => {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) -
    Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
};

const SquatPage = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [feedback, setFeedback] = useState("Good form");
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(640);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [userNFT, setUserNFT] = useState<string | null>(null);
  const [dayNFT, setDayNFT] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState('s1');
  const [stateSequence, setStateSequence] = useState(2);
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();

  // State tracking
  interface StateTracker {
    stateSeq: string[];
    currentState: string | null;
    prevState: string | null;
    incorrectPosture: boolean;
  }

  const stateRef = useRef<StateTracker>({
    stateSeq: [],
    currentState: null,
    prevState: null,
    incorrectPosture: false
  });

  // Thresholds
  const THRESHOLDS = {
    HIP_KNEE_VERT: {
      NORMAL: [0, 45],
      TRANS: [45, 90],
      PASS: [90, 135]
    },
    HIP_THRESH: [60, 120],
    KNEE_THRESH: [50, 100, 130],
    ANKLE_THRESH: 80,
    OFFSET_THRESH: 30
  };

  // Load NFT data
  useEffect(() => {
    const nft = localStorage.getItem("userNFT");
    if(nft != null && nft != '') {
      try {
        const nftData = JSON.parse(nft);
        setTimeout(() => {
          setUserNFT(nftData.name || nft.toString());
        }, 100);
      } catch {
        setTimeout(() => {
          setUserNFT(nft.toString());
        }, 100);
      }
    }
    const day = localStorage.getItem("dayNFT");
    if(day != null && day != '') {
      setTimeout(() => {
        setDayNFT(day.toString());
      }, 100);
    }
  }, [address]);

  // Camera permission request function
  const requestCameraPermission = async () => {
    if (!isBrowser) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: windowWidth },
          height: { ideal: Math.floor(windowWidth * 0.75) }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      return true;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied. Please grant permission to use this feature.');
      setHasPermission(false);
      setIsLoading(false);
      return false;
    }
  };

  const getSquatState = (kneeAngle: number): string | null => {
    if (THRESHOLDS.HIP_KNEE_VERT.NORMAL[0] <= kneeAngle &&
      kneeAngle <= THRESHOLDS.HIP_KNEE_VERT.NORMAL[1]) {
      return 's1';
    } else if (THRESHOLDS.HIP_KNEE_VERT.TRANS[0] <= kneeAngle &&
      kneeAngle <= THRESHOLDS.HIP_KNEE_VERT.TRANS[1]) {
      return 's2';
    } else if (THRESHOLDS.HIP_KNEE_VERT.PASS[0] <= kneeAngle &&
      kneeAngle <= THRESHOLDS.HIP_KNEE_VERT.PASS[1]) {
      return 's3';
    }
    return null;
  };

  const updateStateSequence = (state: string): void => {
    const stateTracker = stateRef.current;

    if (state === 's2') {
      if ((!stateTracker.stateSeq.includes('s3') &&
        stateTracker.stateSeq.filter(s => s === 's2').length === 0) ||
        (stateTracker.stateSeq.includes('s3') &&
          stateTracker.stateSeq.filter(s => s === 's2').length === 1)) {
        stateTracker.stateSeq.push(state);
      }
    } else if (state === 's3') {
      if (!stateTracker.stateSeq.includes(state) &&
        stateTracker.stateSeq.includes('s2')) {
        stateTracker.stateSeq.push(state);
      }
    }
  };

  const checkSquat = (landmarks: any[]): void => {
    if (!landmarks) return;

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    // Calculate vertical angles
    const leftKneeAngle = findAngle(
      leftHip,
      leftKnee,
      { x: leftKnee.x, y: 0 }
    );

    const rightKneeAngle = findAngle(
      rightHip,
      rightKnee,
      { x: rightKnee.x, y: 0 }
    );

    const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
    const detectedState = getSquatState(kneeAngle);

    // Update UI state
    if (detectedState) {
      setCurrentState(detectedState);
      updateStateSequence(detectedState);
      setStateSequence(stateRef.current.stateSeq.length);
    }

    // Check if squat is complete
    if (detectedState === 's1') {
      const stateTracker = stateRef.current;

      if (stateTracker.stateSeq.length === 3 &&
        !stateTracker.incorrectPosture) {
        setCorrectCount(prev => prev + 1);
        setFeedback('Perfect squat!');
      } else if (stateTracker.incorrectPosture ||
        (stateTracker.stateSeq.includes('s2') &&
          stateTracker.stateSeq.length === 1)) {
        setIncorrectCount(prev => prev + 1);
        setFeedback('Incorrect form!');
      }

      // Reset state
      stateTracker.stateSeq = [];
      stateTracker.incorrectPosture = false;
    } else {
      // Check form issues
      const hipAngle = findAngle(
        leftShoulder,
        leftHip,
        leftKnee
      );

      const ankleAngle = findAngle(
        leftKnee,
        leftAnkle,
        { x: leftAnkle.x, y: 0 }
      );

      if (hipAngle > THRESHOLDS.HIP_THRESH[1]) {
        setFeedback('Keep your back straight!');
        stateRef.current.incorrectPosture = true;
      } else if (ankleAngle > THRESHOLDS.ANKLE_THRESH) {
        setFeedback('Knees going too far over toes!');
        stateRef.current.incorrectPosture = true;
      } else if (kneeAngle > THRESHOLDS.KNEE_THRESH[2]) {
        setFeedback('Squat too deep!');
        stateRef.current.incorrectPosture = true;
      }
    }

    stateRef.current.prevState = detectedState;
  };

  const drawPose = (results: any): void => {
    const canvas = canvasRef.current;
    if (!canvas || !results.poseLandmarks) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw landmarks
    for (const landmark of results.poseLandmarks) {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#00ffff';
      ctx.fill();
    }

    // Draw connecting lines for legs and torso
    const connections = [
      [11, 13, 15], // left arm
      [12, 14, 16], // right arm
      [11, 23, 25, 27], // left leg
      [12, 24, 26, 28], // right leg
      [11, 12], // shoulders
      [23, 24]  // hips
    ];

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;

    for (const connection of connections) {
      for (let i = 0; i < connection.length - 1; i++) {
        const start = results.poseLandmarks[connection[i]];
        const end = results.poseLandmarks[connection[i + 1]];

        ctx.beginPath();
        ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
        ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
        ctx.stroke();
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!hasPermission) {
      setIsLoading(false);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && hasPermission) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, hasPermission]);

  // Mission completion logic
  const completeMission = async () => {
    setIsMinting(true);
    try {
      await writeContract({
        abi,
        address: process.env.NEXT_PUBLIC_WEFIT_NFT as `0x${string}`,
        functionName: 'completeMission',
        args: [userNFT as `0x${string}`, BigInt(parseInt(dayNFT || '0') + 1)],
      });
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Claim failed!');
      localStorage.setItem("dayNFT",(parseInt(dayNFT || '0') + 1).toString());
      router.push('/mission');
    }
  };

  // Check mission completion
  useEffect(() => {
    const checkMission = async () => {
      if (correctCount === 5) {
        setShowRewardModal(true);
      }
      if (correctCount + incorrectCount === 50) {
        alert("Mission failed!");
        router.push('/mission');
      }
    }
    checkMission();
  }, [correctCount, incorrectCount]);

  // Handle minting success
  useEffect(() => {
    if (hash != null) {
      setIsMinting(false);
      setTimeout(() => {
        setShowRewardModal(false);
        router.push('/mission');
      }, 1000);
    }
  }, [hash]);

  // MediaPipe setup
  useEffect(() => {
    let camera: any;
    let isComponentMounted = true;
    const currentVideo = videoRef.current;

    const setupPose = async () => {
      if (!isBrowser || isLoading) return;

      try {
        const permissionGranted = await requestCameraPermission();
        if (!permissionGranted) return;

        const [
          tf,
          tfBackend,
          mediapipePose,
          mediapipeCamera,
        ] = await Promise.all([
          import('@tensorflow/tfjs-core'),
          import('@tensorflow/tfjs-backend-webgl'),
          import('@mediapipe/pose'),
          import('@mediapipe/camera_utils'),
        ]);

        await tf.ready();
        await tf.setBackend('webgl');

        const PoseCtor = (window as any).Pose || mediapipePose.Pose;

        if (typeof PoseCtor !== 'function') {
          throw new Error('Pose constructor not found');
        }

        const pose = new PoseCtor({
          locateFile: (file: any) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          }
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults((results: any) => {
          if (isComponentMounted && isPlaying) {
            drawPose(results);
            checkSquat(results.poseLandmarks);
          }
        });

        const CameraModule = mediapipeCamera.Camera || (window as any).Camera;

        if (CameraModule && hasPermission && currentVideo) {
          camera = new CameraModule(currentVideo, {
            onFrame: async () => {
              if (currentVideo && isComponentMounted && isPlaying) {
                await pose.send({ image: currentVideo });
              }
            },
            width: 640,
            height: 480
          });

          await camera.start();
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error('Error setting up pose detection:', error);
        setError(`Failed to initialize: ${error.message}`);
        setIsLoading(false);
      }
    };

    const loadMediaPipeScript = () => {
      if (isBrowser && !(window as any).Pose) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js';
        script.async = true;
        script.onload = setupPose;
        document.body.appendChild(script);
      } else {
        setupPose();
      }
    };

    if (isBrowser && !isLoading) {
      loadMediaPipeScript();
    }

    return () => {
      isComponentMounted = false;
      if (camera) {
        camera.stop();
      }
      if (currentVideo?.srcObject && currentVideo.srcObject instanceof MediaStream) {
        const tracks = currentVideo.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [hasPermission, isLoading, isPlaying]);

  // Reward Modal Component
  const RewardModal: React.FC = () => {
    return (
      <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black bg-opacity-70 p-4">
        <div className="relative bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          {/* Close Button */}
          <button 
            onClick={() => setShowRewardModal(false)}
            className="absolute top-4 right-4 bg-black rounded-2xl p-3 hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Title */}
          <h1 className="text-3xl font-black text-black mb-4 tracking-tight">
            Mission Completed!
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg font-bold text-black mb-6 leading-tight">
            You're on your way to fitness success.
            <br />
            Claim reward now!
          </p>

          {/* Claim Button */}
          <div className="mb-8">
            <button
              onClick={() => {
                completeMission();
              }}
              disabled={isMinting}
              className="bg-white text-black font-black text-xl py-4 px-12 rounded-full border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMinting ? 'Claiming...' : 'Claim Reward'}
            </button>
          </div>

          {/* Character Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Main Character */}
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center border-4 border-black">
                <div className="text-6xl">🏋️</div>
              </div>
              
              {/* Dumbbells */}
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-8 bg-gray-600 rounded-full border-2 border-black"></div>
              </div>
              <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-8 bg-gray-600 rounded-full border-2 border-black"></div>
              </div>
              
              {/* Sweat drops */}
              <div className="absolute -top-2 left-1/4 w-2 h-3 bg-blue-300 rounded-full transform rotate-12"></div>
              <div className="absolute -top-1 right-1/4 w-1.5 h-2.5 bg-blue-300 rounded-full transform -rotate-12"></div>
              <div className="absolute top-1 left-1/3 w-1 h-2 bg-blue-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-screen w-full bg-gray-200 overflow-hidden">
      {/* Reward Modal */}
      {showRewardModal && <RewardModal />}
      
      {/* NFT Warning */}
      {(userNFT == null || userNFT == '') && (
        <div className="absolute top-20 left-4 right-4 z-20 bg-red-500/90 backdrop-blur-sm text-white p-3 rounded-lg text-center border border-red-400">
          <p className="text-sm font-medium">Select NFT in profile to claim reward after exercise</p>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="absolute top-20 left-4 right-4 z-20 bg-red-500/90 backdrop-blur-sm text-white p-3 rounded-lg text-center border border-red-400">
          <p className="text-sm font-medium">Error: {error}</p>
        </div>
      )}
      {/* Top Overlay Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/30"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        <h1 className="text-lg font-bold text-white text-center bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          Squat with AI Trainer
        </h1>
        
        <button 
          onClick={() => {
            setCorrectCount(0);
            setIncorrectCount(0);
            setCurrentTime(0);
            setStateSequence(0);
            setCurrentState('s1');
            stateRef.current = {
              stateSeq: [],
              currentState: null,
              prevState: null,
              incorrectPosture: false
            };
          }}
          className="p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/30"
        >
          <RotateCcw className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Main Video Area */}
      <div className="relative h-full w-full">
        {hasPermission ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
            playsInline
            muted
            autoPlay
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
              <p className="text-gray-600">Tap play to start camera</p>
            </div>
          </div>
        )}

        {/* AI Pose Detection Overlay */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: 'scaleX(-1)' }}
          width={windowWidth}
          height={Math.floor(windowWidth * 0.75)}
        />

        {/* Progress Bar (right side) */}
        <div className="absolute right-4 top-24 bottom-32 w-2">
          <div className="h-full bg-white/30 rounded-full overflow-hidden">
            <div 
              className="w-full bg-orange-500 transition-all duration-300 rounded-full"
              style={{ 
                height: `${Math.min((correctCount / 10) * 100, 100)}%`,
                marginTop: 'auto'
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 text-white">
          <div className="bg-orange-500 rounded-lg px-3 py-2 text-sm font-medium">
            <div>{currentState.toUpperCase()}</div>
            <div className="text-xs opacity-90">State</div>
          </div>
          
          <div className="bg-orange-500 rounded-lg px-3 py-2 text-sm font-medium">
            <div>{stateSequence}</div>
            <div className="text-xs opacity-90">Sequence</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold">{feedback}</div>
            <div className="text-xs opacity-90">AI Detection Active</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="bg-green-500 rounded-lg px-4 py-3 text-white font-medium">
            Correct: {correctCount}
          </div>
          
          <button 
            onClick={togglePlayPause}
            className="bg-white rounded-full p-4"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-black" />
            ) : (
              <Play className="w-8 h-8 text-black" />
            )}
          </button>
          
          <div className="bg-red-500 rounded-lg px-4 py-3 text-white font-medium">
            Incorrect: {incorrectCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SquatPage), {
  ssr: false
});