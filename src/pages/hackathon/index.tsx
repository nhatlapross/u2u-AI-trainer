import React from "react";
import { NextPage } from 'next';
import FitnessHackathonSlider from "@/components/Hackathon/Hackathon";

const NFTMissionsPage: NextPage = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white flex items-center justify-center">
      <div className="w-full h-full">
        <FitnessHackathonSlider />
      </div>
    </div>
  )
}

export default NFTMissionsPage;