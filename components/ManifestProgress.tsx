// components/ManifestProgress.tsx
"use client";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { useManifestStore } from "@/lib/fetchManifest";

const ManifestProgress = () => {
  const progress = useManifestStore((state) => state.progress);

  if (progress === 0 || progress === 100) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background p-4">
      <h2 className="text-2xl mb-4">Updating Destiny Manifest...</h2>
      <Progress value={progress} className="w-full mb-2" />
      <p>{Math.round(progress)}% complete</p>
    </div>
  );
};

export default ManifestProgress;
