// itemDropzones.tsx
import { ProfileData } from "@/lib/interfaces";
import { useState } from "react";
import { SkeletonGuy } from "@/components/skeleton";
import { useProfileData } from "@/app/hooks/useProfileData";
import CharacterSm from "@/components/Character/characterSm";
import { useAuthContext } from "@/components/Auth/AuthContext";

const CharacterList: React.FC = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);

  if (isLoading) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const characterData = data?.Response.characters.data;

  if (!characterData) {
    return <div className="hidden">No profile data found</div>;
  }

  return (
    <div className="flex flex-row justify-between items-center gap-2">
      {Object.keys(characterData).map((characterId) => {
        const character = characterData[characterId];
        return (
          <div
            key={characterId}
            className="flex flex-col justify-center items-center w-1/3 p-2"
          >
            <CharacterSm
              characterId={characterId}
              classType={character.classType}
              raceType={character.raceType}
              light={character.light}
              emblemPath={character.emblemPath}
              emblemBackgroundPath={character.emblemBackgroundPath}
              emblemHash={character.emblemHash}
              stats={character.stats}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CharacterList;
