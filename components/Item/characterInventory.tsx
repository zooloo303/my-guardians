import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { transferItem } from "@/lib/transferUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { CharacterInventoryProps, TransferData } from "@/lib/interfaces";
import { armorBucketHash, weaponBucketHash, classes, races } from "@/lib/destinyEnums";

const CharacterInventory: React.FC<CharacterInventoryProps> = ({
  filteredItems,
}) => {
  const SOURCE = "CharacterInventory"
  const queryClient = useQueryClient();
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData } = useProfileData(membershipId);

  const isWeaponOrArmor = (bucketHash: number) => {
    return (
      weaponBucketHash.includes(bucketHash) || armorBucketHash.includes(bucketHash)
    );
  };

  const hasItems = Object.values(filteredItems).some((characterInventory) =>
    characterInventory.items.some((item) => isWeaponOrArmor(item.bucketHash))
  );

  const getCharacterInfo = (characterId: string) => {
    const character = profileData?.Response.characters.data?.[characterId];
    if (character) {
      return `${classes[character.classType]}, ${races[character.raceType]}`;
    }
    return "vault?";
  };

  const handleDragStart = (e: any, item: any, characterId: string, SOURCE: string) => {
    const itemWithCharacterId = { ...item, characterId, SOURCE };
    e.dataTransfer.setData("application/json", JSON.stringify(itemWithCharacterId));
    e.dataTransfer.effectAllowed = "move";
    
    if (manifestData && manifestData.DestinyInventoryItemDefinition) {
      const itemData = manifestData.DestinyInventoryItemDefinition[item.itemHash];
      if (itemData) {
        console.log(`Dragging item: ${itemData.displayProperties.name} from ${getCharacterInfo(characterId)}`);
      } else {
        console.log(`Dragging item: Unknown item from ${getCharacterInfo(characterId)}`);
      }
    } else {
      console.log(`Dragging item: Unknown item from ${getCharacterInfo(characterId)}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetCharacterId: string, event: React.DragEvent) => {
    event.preventDefault();
    const itemData = event.dataTransfer.getData("application/json");
    if (itemData && membershipId) {
      const item = JSON.parse(itemData);
      const membershipType: number =
        profileData?.Response.profile.data.userInfo.membershipType;

      try {
        const itemName = manifestData?.DestinyInventoryItemDefinition?.[item.itemHash]?.displayProperties.name || "Unknown item";

        console.log(
          `Dropping item: ${itemName} from ${getCharacterInfo(item.characterId)} to ${getCharacterInfo(targetCharacterId)}`
        );

        // Transfer between characters
        if (item.characterId && item.characterId !== targetCharacterId) {
          const transferToVault: TransferData = {
            username: membershipId,
            itemReferenceHash: item.itemHash,
            stackSize: 1,
            transferToVault: true,
            itemId: item.itemInstanceId,
            characterId: item.characterId,
            membershipType: membershipType,
          };
          await transferItem(transferToVault);
          console.log(`Transferred ${itemName} to vault`);

          const transferToCharacter: TransferData = {
            username: membershipId,
            itemReferenceHash: item.itemHash,
            stackSize: 1,
            transferToVault: false,
            itemId: item.itemInstanceId,
            characterId: targetCharacterId,
            membershipType: membershipType,
          };
          await transferItem(transferToCharacter);
          console.log(`Transferred ${itemName} to ${getCharacterInfo(targetCharacterId)}`);
        }

        await queryClient.invalidateQueries({
          queryKey: ["profileData", membershipId],
        });
      } catch (error) {
        console.error("Transfer failed:", error);
      }
    }
  };

  return (
    <>
      {hasItems && (
        <Label className="pl-2 pb-1" htmlFor="character">
          Character Inventory
        </Label>
      )}
      <div onDragOver={handleDragOver} className="flex flex-row gap-1">
        {Object.entries(filteredItems).map(
          ([characterId, characterInventory]) => (
            <div
              key={characterId}
              className="w-1/3 p-2 border rounded-xl"
              onDrop={(e) => handleDrop(characterId, e)}
            >
              <div className="flex flex-grid flex-wrap items-center justify-center grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                {characterInventory.items
                  .filter((item) => isWeaponOrArmor(item.bucketHash))
                  .map((item) => (
                    <motion.div
                      key={`${characterId}-${item.itemInstanceId}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, characterId, SOURCE)}
                      className="item cursor-grab active:cursor-grabbing"
                    >
                      <Item
                        itemHash={item.itemHash}
                        itemInstanceId={item.itemInstanceId}
                        characterId={characterId}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default CharacterInventory;
