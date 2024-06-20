"use client";
import { ProfileData } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import Character from "@/components/Character/character";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";

const MyCharacters: React.FC = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);

  if (isLoading) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const characterData = data?.Response.characters.data;

  if (!characterData) {
    return <div className="hidden">No profile data found</div>; // Subtle empty state
  }

  return (
    <div className="flex flex-row justify-between items-center gap-2">
      {Object.keys(characterData).map((characterId) => {
        const character = characterData[characterId];
        return (
          <div key={characterId} className="w-1/3">
            <Character
              characterId={characterId}
              classType={character.classType}
              raceType={character.raceType}
              light={character.light}
              emblemBackgroundPath={character.emblemBackgroundPath}
              emblemHash={character.emblemHash}
              stats={character.stats}
              emblemPath={""}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MyCharacters;
