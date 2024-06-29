"use client";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import SweeperBot from "@/components/Chat/sweeperBot";
import { useProfileData } from "@/app/hooks/useProfileData";
import MyCharacters from "@/components/Character/myCharacters";
import { useAuthContext } from "@/components/Auth/AuthContext";
import SubclassSelector from "@/components/Character/SubclassSelector";
import CharacterSubclass from "@/components/Character/characterSubclass";
import CharacterExoticArmor from "@/components/Character/ExoticArmorSelector";
import StatPrioritySelector from "@/components/Character/StatPrioritySelector";
import BuildPrefs from "@/components/Character/buildPrefs";

export default function CharacterPage({
  params,
}: {
  params: { characterId: string };
}) {
  const { characterId } = useParams();
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading, error } = useProfileData(membershipId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading character data</div>;

  const character =
    profileData?.Response.characters.data[characterId as string];

  if (!character) return <div>Character not found</div>;

  const handleSubclassChange = (subclassHash: string | null) => {
    console.log("Selected subclass:", subclassHash);
    // Add any logic you want to perform when the subclass changes
  };
  return (
    <>
      <div className="p-2 flex flex-col items-center">

        <MyCharacters characterId={characterId as string} />

        <div className="p-4 flex flex-row items-top justify-between space-x-5">
        <CharacterExoticArmor characterId={params.characterId} />
        <BuildPrefs characterId={params.characterId} />
        <SweeperBot />
        </div>
      </div>
    </>
  );
}

function getClassName(classType: number): string {
  const classNames = ["Titan", "Hunter", "Warlock"];
  return classNames[classType] || "Unknown";
}

function getRaceName(raceType: number): string {
  const raceNames = ["Human", "Awoken", "Exo"];
  return raceNames[raceType] || "Unknown";
}
