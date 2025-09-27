'use client';

import React, { lazy, Suspense } from "react";

// Lazy load ProfilePage to improve initial loading performance
const ProfilePage = lazy(() => import("@/components/Profile/index"));

const NFTMissionsPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
      <div className="w-full">
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-orange-500">Loading Profile...</p>
            </div>
          </div>
        }>
          <ProfilePage />
        </Suspense>
      </div>
    </div>
  )
}

export default NFTMissionsPage;