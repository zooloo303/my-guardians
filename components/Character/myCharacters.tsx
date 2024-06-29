"use client";
import { ProfileData } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import Character from "@/components/Character/character";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";

interface MyCharactersProps {
  characterId?: string;
}

const MyCharacters: React.FC<MyCharactersProps> = ({ characterId }) => {
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

  const charactersToRender = characterId
    ? characterData[characterId]
      ? { [characterId]: characterData[characterId] }
      : {}
    : characterData;

  if (Object.keys(charactersToRender).length === 0) {
    return <div className="hidden">No characters found</div>;
  }

  return (
    <div className={`flex ${characterId ? 'justify-center' : 'justify-between'} items-center gap-2`}>
      {Object.entries(charactersToRender).map(([id, character]) => (
        <div key={id} className={characterId ? 'w-full' : 'w-1/3'}>
          <Character
            characterId={id}
            classType={character.classType}
            raceType={character.raceType}
            light={character.light}
            emblemBackgroundPath={character.emblemBackgroundPath}
            emblemHash={character.emblemHash}
            stats={character.stats}
            emblemPath={""}
          />
        </div>
      ))}
    </div>
  );
};

export default MyCharacters;