import React from "react";
import { NextPage } from 'next';
import ProfilePage from "@/components/Profile/index";

const NFTMissionsPage: NextPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
      <ProfilePage />
    </div>
  )
}

export default NFTMissionsPage;