"use client";
import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { ProfileData } from "@/lib/interfaces";
import { useToast } from "@/app/hooks/use-toast";
import { SkeletonGuy } from "@/components/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { equipItem, transferItem } from "@/lib/transferUtils";
import { useAuthContext } from "@/components/Auth/AuthContext";
import CharacterSubclass from "../Character/characterSubclass";
import { armorBucketHash, weaponBucketHash, classes, races } from "@/lib/destinyEnums";
import {
  EquipData,
  TransferData,
  CharacterEquipmentProps,
} from "@/lib/interfaces";

const CharacterEquipment: React.FC<CharacterEquipmentProps> = ({
  showSubclass,
}) => {
  const SOURCE = "CharacterEquipment"
  const queryClient = useQueryClient();
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();
  const { toast } = useToast();

  if (isLoading) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const equipmentData = data?.Response.characterEquipment.data;
  const characterData = data?.Response.characters.data;

  if (!equipmentData || !membershipId) {
    return <div className="hidden">No profile data found</div>;
  }

  const getCharacterInfo = (characterId: string) => {
    const character = characterData?.[characterId];
    if (character) {
      return `${character.classType}, ${character.raceType}`;
    }
    return "Unknown character";
  };

  const handleDragStart = (e: any, item: any, characterId: string, SOURCE: string) => {
    const itemWithCharacterId = { ...item, characterId, SOURCE };
    e.dataTransfer.setData("application/json", JSON.stringify(itemWithCharacterId));
    e.dataTransfer.effectAllowed = "move";

    if (manifestData && manifestData.DestinyInventoryItemDefinition) {
      const itemData =
        manifestData.DestinyInventoryItemDefinition[item.itemHash];
      if (itemData) {
        console.log(`Dragging item: ${itemData.displayProperties.name}`);
      } else {
        console.log(`Dragging item: Unknown item`);
      }
    } else {
      console.log(`Dragging item: Unknown item`);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = async (characterId: string, event: React.DragEvent) => {
    event.preventDefault();
    const itemData = event.dataTransfer.getData("application/json");
    if (itemData) {
      const item = JSON.parse(itemData);
      const membershipType: number =
        profileData?.Response.profile.data.userInfo.membershipType;

      try {
        const itemName =
          manifestData?.DestinyInventoryItemDefinition?.[item.itemHash]
            ?.displayProperties.name || "Unknown item";

        console.log(
          `Dropping item: ${itemName} from ${getCharacterInfo(
            item.characterId
          )} to ${getCharacterInfo(characterId)}`
        );

        // Transfer item to vault if it's from another character
        if (item.characterId && item.characterId !== characterId) {
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
        }

        // Transfer item from vault to target character
        const transferToCharacter: TransferData = {
          username: membershipId,
          itemReferenceHash: item.itemHash,
          stackSize: 1,
          transferToVault: false,
          itemId: item.itemInstanceId,
          characterId: characterId,
          membershipType: membershipType,
        };
        await transferItem(transferToCharacter);
        console.log(
          `Transferred ${itemName} to ${getCharacterInfo(characterId)}`
        );

        // Equip item on target character
        const equipData: EquipData = {
          username: membershipId,
          itemId: item.itemInstanceId,
          characterId,
          membershipType: membershipType,
        };
        await equipItem(equipData);
        console.log(`Equipped ${itemName} on ${getCharacterInfo(characterId)}`);

        await queryClient.invalidateQueries({
          queryKey: ["profileData", membershipId],
        });
      } catch (error) {
        console.error("Equip on Character failed:", error);
      }
    }
  };

  return (
    <>
      <Label className="pl-2" htmlFor="equipped">
        Equipped Items
      </Label>
      <div
        onDragOver={handleDragOver}
        className="flex flex-row justify-between items-center gap-2"
      >
        {Object.entries(equipmentData).map(
          ([characterId, characterEquipment]) => (
            <div
              key={characterId}
              className="w-1/3 border p-2 rounded-md"
              onDrop={(e) => handleDrop(characterId, e)}
            >
              {showSubclass && <CharacterSubclass characterId={characterId} />}
              <div className="pt-2 gap-1 flex flex-grid flex-wrap justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {characterEquipment.items
                  .filter((item) => weaponBucketHash.includes(item.bucketHash))
                  .map((item) => (
                    <motion.div
                      key={`${characterId}-${item.itemInstanceId}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, characterId, SOURCE)}
                      className="item cursor-grab active:cursor-grabbing"
                    >
                      <Item
                        key={item.itemInstanceId}
                        itemHash={item.itemHash}
                        itemInstanceId={item.itemInstanceId}
                      />
                    </motion.div>
                  ))}
              </div>
              <div className="pt-2 gap-1 flex flex-grid flex-wrap justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {characterEquipment.items
                  .filter((item) => armorBucketHash.includes(item.bucketHash))
                  .map((item) => (
                    <motion.div
                      key={`${characterId}-${item.itemInstanceId}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, characterId, SOURCE)}
                      className="item cursor-grab active:cursor-grabbing"
                    >
                      <Item
                        key={item.itemInstanceId}
                        itemHash={item.itemHash}
                        itemInstanceId={item.itemInstanceId}
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

export default CharacterEquipment;
