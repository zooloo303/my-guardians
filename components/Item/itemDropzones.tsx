// itemDropzones.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import VaultCard from "../Vault/vaultCard";
import { SkeletonGuy } from "@/components/skeleton";
import { useProfileData } from "@/app/hooks/useProfileData";
import CharacterSm from "@/components/Character/characterSm";
import { ProfileData, InventoryItem } from "@/lib/interfaces";
import { useAuthContext } from "@/components/Auth/AuthContext";

const ItemDropzone: React.FC = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);
  const [isHighlighted, setIsHighlighted] = useState<string | null>(null);

  if (isLoading) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const characterData = data?.Response.characters.data;

  if (!characterData) {
    return <div className="hidden">No profile data found</div>;
  }

  const handleDragEnter = (characterId: string) => {
    setIsHighlighted(characterId);
  };

  const handleDragLeave = () => {
    setIsHighlighted(null);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Allow drop
    console.log('Drag over dropzone');
  };

  const handleDrop = async (characterId: string, event: React.DragEvent) => {
    event.preventDefault();
    setIsHighlighted(null);
    const itemData = event.dataTransfer.getData("application/json");
    if (itemData) {
      const item = JSON.parse(itemData) as InventoryItem;
      console.log(`Dropped item ${item.itemInstanceId} on character ${characterId}`);
      // Handle the item drop logic, e.g., transfer or equip
    }
  };

  return (
    <div className="flex flex-grid grid-cols-2 grid-rows-2 gap-1">
      {Object.keys(characterData).map((characterId) => {
        const character = characterData[characterId];
        return (
          <motion.div
            key={characterId}
            className={"w-36 dropzone"}
            onDragEnter={() => handleDragEnter(characterId)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(characterId, e)}
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
        className={"w-36 dropzone"}
        onDragEnter={() => handleDragEnter("vault")}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop("vault", e)}
        whileHover={{ scale: 1.1 }}
      >
        <VaultCard noOfItems={0} />
      </motion.div>
    </div>
  );
};

export default ItemDropzone;
