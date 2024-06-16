import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CharacterType } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { classes, races, statOrder } from "@/lib/destinyEnums";

const Character: React.FC<CharacterType> = ({ characterId }) => {
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
    light,
    emblemBackgroundPath,
    emblemHash,
    stats,
  } = characterData;

  const className = classes[classType];
  const raceName = races[raceType];

  return (
    <div className="max-w-lg p-2">
      <div className="relative h-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-md"
          style={{
            backgroundImage: `url(http://www.bungie.net${emblemBackgroundPath})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-end p-4 rounded-md">
          <div className="relative z-10 text-right">
            <h2 className="text-lg">{className}</h2>
            <p className="text-xs">{raceName}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-row gap-2">
        {statOrder.map((hash) =>
          statDefinitions[hash] ? (
            <Badge
              key={hash}
              className="flex items-center justify-between rounded-md"
            >
              <span className="flex items-center gap-2">
                <Image
                  src={
                    "http://www.bungie.net" +
                    statDefinitions[hash].displayProperties.icon
                  }
                  alt={`${statDefinitions[hash].displayProperties.name} icon`}
                  width={24}
                  height={24}
                />
              </span>
              <span>{stats[hash]}</span>
            </Badge>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Character;
