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

    if (!profileData) {
        return <div>No profile data found</div>;
    }

    const data = profileData as unknown as ProfileData;
    const characterData = data.Response.characters.data;

    return (
        <div className="flex flex-row justify-between items-center gap-4">
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
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default MyCharacters;
