// components/Item/characterInventory.tsx
import React, { useState } from "react";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { useItemOperations } from "@/app/hooks/useItemOperations";
import { CharacterInventoryProps, InventoryItem } from "@/lib/interfaces";
import { weaponBucketHash, armorBucketHash } from "@/lib/destinyEnums";

const CharacterInventory: React.FC<CharacterInventoryProps> = ({ filteredItems }) => {
  const SOURCE = "CharacterInventory";
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData } = useProfileData(membershipId);
  const { transfer, equip, getRandomItem } = useItemOperations();
  const [dragOverCharacterId, setDragOverCharacterId] = useState<string | null>(null);

  const isWeaponOrArmor = (bucketHash: number) => {
    return weaponBucketHash.includes(bucketHash) || armorBucketHash.includes(bucketHash);
  };

  const handleDragStart = (item: InventoryItem, characterId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const itemWithSource = { ...item, characterId, SOURCE };
    e.dataTransfer.setData("application/json", JSON.stringify(itemWithSource));
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add('border', 'border-dashed', 'border-green-500');
  };

  const handleDrop = async (characterId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const item: InventoryItem & { SOURCE: string; characterId: string } = JSON.parse(data);
    const membershipType = profileData?.Response.profile.data.userInfo.membershipType;

    if (!manifestData || !membershipId || !membershipType) return;

    try {
      if (item.SOURCE === "CharacterEquipment" && item.characterId === characterId) {
        const randomItem = getRandomItem(item.characterId, item.bucketHash);
        if (randomItem) {
          await equip(randomItem, item.characterId, membershipType);
        }
      } else if (item.SOURCE === "CharacterEquipment" && item.characterId !== characterId) {
        const randomItem = getRandomItem(item.characterId, item.bucketHash);
        if (randomItem) {
          await equip(randomItem, item.characterId, membershipType);
        }
        await transfer(item, true, item.characterId, membershipType);
        await transfer(item, false, characterId, membershipType);
      } else if (item.SOURCE === "CharacterInventory" && item.characterId !== characterId) {
        await transfer(item, true, item.characterId, membershipType);
        await transfer(item, false, characterId, membershipType);
      } else if (item.SOURCE === "ProfileInventory") {
        await transfer(item, false, characterId, membershipType);
      }
    } catch (error) {
      console.error("Transfer or equip operation failed:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, characterId: string) => {
    e.preventDefault();
    setDragOverCharacterId(characterId);
  };

  const handleDragLeave = () => {
    setDragOverCharacterId(null);
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Remove the Tailwind CSS classes when the drag ends
    e.currentTarget.classList.remove('border', 'border-dashed', 'border-green-500');
  };
  
  return (
    <>
      <Label className="pl-2 pb-1" htmlFor="character">
        Character Inventory
      </Label>
      <div className="flex flex-row gap-1">
        {Object.entries(filteredItems).map(([characterId, characterInventory]) => (
          <div
            key={characterId}
            className={`w-1/3 p-2 border rounded-xl transition-shadow duration-200 ${
              dragOverCharacterId === characterId ? 'shadow-inner shadow-green-500/50' : ''
            }`}
            onDrop={(e) => handleDrop(characterId, e)}
            onDragOver={(e) => handleDragOver(e, characterId)}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-wrap items-top justify-center gap-1">
              {characterInventory.items
                .filter((item) => isWeaponOrArmor(item.bucketHash))
                .map((item) => (
                  <div
                    key={`${characterId}-${item.itemInstanceId}`}
                    draggable
                    onDragStart={handleDragStart(item, characterId)}
                    onDragEnd={handleDragEnd}
                    className="item cursor-grab active:cursor-grabbing"
                  >
                    <Item
                      itemHash={item.itemHash}
                      itemInstanceId={item.itemInstanceId}
                      characterId={characterId}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CharacterInventory;