"use client";
import { useParams } from "next/navigation";
import { useProfileData } from "@/app/hooks/useProfileData";
import CharacterSm from "@/components/Character/characterSm";
import { useAuthContext } from "@/components/Auth/AuthContext";
import SubclassSelector from "@/components/Character/SubclassSelector";
import CharacterExoticArmor from "@/components/Character/ExoticArmorSelector";
import StatPrioritySelector from "@/components/Character/StatPrioritySelector";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

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
      <div className="p-4 flex flex-row items-center justify-center space-x-2 h-screen">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{getClassName(character.classType)}</CardTitle>
              <CardDescription>
                {getRaceName(character.raceType)}
              </CardDescription>
            </div>
            <CharacterSm
              characterId={character.characterId}
              classType={character.classType}
              raceType={character.raceType}
              light={character.light}
              emblemPath={character.emblemPath}
              emblemBackgroundPath={character.emblemBackgroundPath}
              emblemHash={character.emblemHash}
              stats={character.stats}
            />
          </CardHeader>
          <CardContent>
            <p>Level: {character.baseCharacterLevel}</p>
            <p>Light: {character.light}</p>
            <p>Minutes Played: {character.minutesPlayedTotal}</p>
          </CardContent>
          <CardFooter>
            <p>
              Last Played: {new Date(character.dateLastPlayed).toLocaleString()}
            </p>
          </CardFooter>
        </Card>
        <CharacterExoticArmor characterId={params.characterId} />
        <StatPrioritySelector />
        <SubclassSelector characterId={params.characterId} />
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

function getGenderName(genderType: number): string {
  const genderNames = ["Body Type 1", "Body Type 2"];
  return genderNames[genderType] || "Unknown";
}
