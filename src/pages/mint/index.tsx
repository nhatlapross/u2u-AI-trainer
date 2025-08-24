import React from "react";
import { NextPage } from 'next';
import MintNFTPage from "@/components/MintNFT/MintNFT";

const NFTMissionsPage: NextPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
      <div className="w-full">
        <MintNFTPage />
      </div>
    </div>
  )
}

export default NFTMissionsPage;