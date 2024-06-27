import { CharacterType } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { classes, races } from "@/lib/destinyEnums";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { classType, raceType, emblemPath } = characterData;
  const className = classes[classType];
  const raceName = races[raceType];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-14 h-14 flex items-center justify-center">
            <Avatar>
              <AvatarImage
                src={`https://www.bungie.net${emblemPath}`}
                alt={"itemData.displayProperties.name"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {className}-{raceName}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CharacterSm;
