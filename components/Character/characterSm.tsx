import { CharacterType } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { classes, races } from "@/lib/destinyEnums";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const CharacterSm: React.FC<CharacterType> = ({ characterId }) => {
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData } = useProfileData(membershipId);

  if (!manifestData) {
    return <SkeletonGuy />;
  }
  const statDefinitions = manifestData.DestinyStatDefinition;
  if (!statDefinitions) {
    return <div>Stat definitions not found</div>;
  }
  const characterData = profileData.Response.characters.data[characterId];
  if (!characterData) {
    return <div>Character data not found</div>;
  }
  const {
    classType,
    raceType,
    emblemPath,
  } = characterData;

  const className = classes[classType];
  const raceName = races[raceType];

  return (
    <Card>
      <CardHeader>
      <Avatar>
      <AvatarImage src={`http://www.bungie.net${emblemPath}`}
                   alt={"itemData.displayProperties.name"} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <CardTitle>{className}</CardTitle>
    <CardDescription>{raceName}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CharacterSm;
