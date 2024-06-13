"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SkeletonGuy } from "@/components/skeleton";
import AuthorizeMe from "@/components/Auth/AuthorizeMe";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";

const Login = () => {
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useState("");
  const { membershipId } = useAuthContext();

  const { data: manifestData, isLoading: manifestLoading } = useManifestData();
  const {
    data: profileData,
    isLoading: profileLoading,
    refetch: fetchProfile,
  } = useProfileData(membershipId);

  useEffect(() => {
    if (membershipId) {
      fetchProfile(); // Fetch profile data when membershipId is available
    }
  }, [membershipId, fetchProfile]);

  useEffect(() => {
    if (!manifestLoading && !profileLoading && manifestData && profileData) {
      router.push("/");
    }
  }, [manifestLoading, profileLoading, manifestData, profileData, router]);

  if (!membershipId) {
    return (
      <main className="pt-48 max-w-[1500px] mx-auto px-6">
        <div className="mt-4 centered gap-5">
          <AuthorizeMe />
        </div>
      </main>
    );
  }

  if (manifestLoading || profileLoading || !manifestData || !profileData) {
    return (
      <main className="pt-48 max-w-[1500px] mx-auto px-6">
        <div className="py-60">
          <SkeletonGuy />
          {loadingMessage && (
            <div className="loading-message">{loadingMessage}</div>
          )}
        </div>
      </main>
    );
  }

  return null;
};

export default Login;
