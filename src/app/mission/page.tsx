'use client';

import React from "react";
import MissionCards from "@/components/ListNFT/MissionCards";

const NFTMissionsPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
      <div className="w-full">
        <MissionCards />
      </div>
    </div>
  )
}

export default NFTMissionsPage;