import VaultCard from "../Vault/vaultCard";
import { ProfileData, InventoryItem } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import CharacterSm from "@/components/Character/characterSm";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { motion } from "framer-motion";

const CharacterDropzone: React.FC = () => {
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

  const handleDrop = async (characterId: string, item: InventoryItem) => {
    // Handle the item drop logic, e.g., transfer or equip
    console.log(`Dropped item ${item.itemInstanceId} on character ${characterId}`);
  };

  return (
    <div className="flex flex-grid grid-cols-2 grid-rows-2 gap-1">
      {Object.keys(characterData).map((characterId) => {
        const character = characterData[characterId];
        return (
          <motion.div
            key={characterId}
            className="w-36 dropzone"
            onDrop={(e) => handleDrop(characterId, JSON.parse(e.dataTransfer.getData("application/json")))}
            whileHover={{ scale: 1.1 }}

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
          </motion.div>
        );
      })}
      <motion.div
        className="w-36 dropzone"
        onDrop={(e) => handleDrop("vault", JSON.parse(e.dataTransfer.getData("application/json")))}
        whileHover={{ scale: 1.1 }}
      >
        <VaultCard noOfItems={0} />
      </motion.div>
    </div>
  );
};

export default CharacterDropzone;
