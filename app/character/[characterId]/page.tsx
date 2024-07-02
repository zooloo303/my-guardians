"use client";
import { useState, useEffect, useCallback } from 'react';
import { useParams } from "next/navigation";
import { SkeletonGuy } from "@/components/skeleton";
import SweeperBot from "@/components/Chat/sweeperBot";
import { useProfileData } from "@/app/hooks/useProfileData";
import BuildPrefs from "@/components/Character/buildPrefs";
import MyCharacters from "@/components/Character/myCharacters";
import { useAuthContext } from "@/components/Auth/AuthContext";
import CharacterExoticArmor from "@/components/Character/ExoticArmorSelector";
import { ArmorOptimizationData } from "@/lib/api/armorApi";

type OptimizationDataState = Omit<ArmorOptimizationData, 'username' | 'chatInput'>;

export default function CharacterPage({
  params,
}: {
  params: { characterId: string };
}) {
  const { characterId } = useParams();
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading, error, isFetching } = useProfileData(membershipId);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [optimizationData, setOptimizationData] = useState<OptimizationDataState>({
    exoticId: { instanceId: '', itemHash: '' },
    statPriorities: [],
    subclass: '',
  });

  useEffect(() => {
    if (profileData && !isLoading && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [profileData, isLoading, hasLoadedOnce]);

  const handleExoticSelect = useCallback((instanceId: string, itemHash: string) => {
    setOptimizationData(prev => ({ ...prev, exoticId: { instanceId, itemHash } }));
  }, []);

  const handleStatPrioritiesChange = useCallback((priorities: string[]) => {
    setOptimizationData(prev => ({ ...prev, statPriorities: priorities }));
  }, []);

  const handleSubclassSelect = useCallback((subclass: string) => {
    setOptimizationData(prev => ({ ...prev, subclass }));
  }, []);

  if (isLoading && !hasLoadedOnce) return <SkeletonGuy />;
  
  if (error && !isFetching) return <div>Error loading character data. Please try again.</div>;

  const character = profileData?.Response.characters.data[characterId as string];

  if (!character && !isFetching) return <SkeletonGuy />;

  return (
    <>
      <div className="p-2 flex flex-col items-center">
        <MyCharacters characterId={characterId as string} />
        <div className="p-2 flex flex-row items-top justify-between space-x-5">
          <CharacterExoticArmor 
            characterId={params.characterId}
            onSelect={handleExoticSelect}
          />
          <BuildPrefs 
            characterId={params.characterId}
            onStatPrioritiesChange={handleStatPrioritiesChange}
            onSubclassSelect={handleSubclassSelect}
          />
          <SweeperBot optimizationData={optimizationData} />
        </div>
      </div>
    </>
  );
}