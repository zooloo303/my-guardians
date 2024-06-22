"use client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { transferItem, equipItem } from "@/lib/transferUtils";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { bucketHash, classes, races } from "@/lib/destinyEnums";
import {
  ProfileInventoryProps,
  TransferData,
  EquipData,
} from "@/lib/interfaces";

const ProfileInventory: React.FC<ProfileInventoryProps> = ({
  filteredItems,
}) => {
  const SOURCE = "ProfileInventory";
  const queryClient = useQueryClient();
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData, isLoading } = useProfileData(membershipId);

  const getCharacterInfo = (characterId: string) => {
    const character = profileData?.Response.characters.data?.[characterId];
    if (character) {
      return `${classes[character.classType]}, ${races[character.raceType]}`;
    }
    return "vault?";
  };
  const getBucketName = (hash: number): string => {
    return bucketHash[hash] || "Unknown Bucket";
  };
  const getRandomItem = (characterId: string, bucketType: number) => {
    return profileData.Response.characterInventories.data[
      characterId
    ].items.find((item: any) => item.bucketHash === bucketType);
  };

  const handleDragStart = (e: any, item: any, SOURCE: string) => {
    const itemWithSource = { ...item, SOURCE };
    e.dataTransfer.setData("application/json", JSON.stringify(itemWithSource));
    e.dataTransfer.effectAllowed = "move";

    if (manifestData && manifestData.DestinyInventoryItemDefinition) {
      let itemDefinition =
        manifestData.DestinyInventoryItemDefinition[item.itemHash];
      if (itemDefinition) {
        console.log(
          `Dragging item: ${
            itemDefinition.displayProperties.name
          } ${getBucketName(item.bucketHash)}from Vault`
        );
      } else {
        console.log(`Dragging Unknown item from Vault`);
      }
    } else {
      console.log(`Dragging Unknown item from Vault`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    console.log("Dragged over vault");
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedItem = e.dataTransfer.getData("application/json");
    const sourceCharacterId = getCharacterInfo(
      JSON.parse(droppedItem).characterId
    );
    const membershipType: number =
      profileData?.Response.profile.data.userInfo.membershipType;
    const item = JSON.parse(droppedItem);

    if (manifestData && manifestData.DestinyInventoryItemDefinition) {
      let itemDefinition =
        manifestData.DestinyInventoryItemDefinition[item.itemHash];
      if (itemDefinition) {
        toast(
          `Dropped ${itemDefinition.displayProperties.name} ${getBucketName(
            item.bucketHash
          )} from ${sourceCharacterId} ${item.SOURCE}`
        );
        console.log(
          `Dropped item: ${
            itemDefinition.displayProperties.name
          } ${getBucketName(item.bucketHash)} from ${sourceCharacterId} ${
            item.SOURCE
          }`
        );
      } else {
        console.log(`Dragging Unknown item from somewhere`);
      }
    } else {
      console.log(`Dragging Unknown item from somewhere`);
    }
    //if item SOURCE = CharacterInventory, transfer to vault
    if (item && membershipId && item.SOURCE === "CharacterInventory") {
      let transferData: TransferData = {
        username: membershipId,
        itemReferenceHash: item.itemHash,
        stackSize: 1,
        transferToVault: true,
        itemId: item.itemInstanceId,
        characterId: item.characterId,
        membershipType: membershipType,
      };
      try {
        await transferItem(transferData);
        if (manifestData && manifestData.DestinyInventoryItemDefinition) {
          let itemDefinition =
            manifestData.DestinyInventoryItemDefinition[item.itemHash];
          if (itemDefinition) {
            toast(
              `Transferred ${itemDefinition.displayProperties.name} to the vault`
            );
            console.log(
              `Transferred ${
                itemDefinition.displayProperties.name
              } ${getBucketName(item.bucketHash)} from ${sourceCharacterId} ${
                item.SOURCE
              } to the Vault`
            );
          } else {
            console.log(`Transfer failed`);
          }
        } else {
          console.log(`Transfer failed`);
        }
        await queryClient.invalidateQueries({
          queryKey: ["profileData", membershipId],
        });
      } catch (error) {
        console.error("Transfer to vault failed:", error);
      }
    }
    //if item SOURCE = CharacterEquipment,
    if (item && membershipId && item.SOURCE === "CharacterEquipment") {
      //equip any other item of the same bucketType
      const randomItem = getRandomItem(item.characterId, item.bucketHash);
      let equipData: EquipData = {
        username: membershipId,
        itemId: randomItem.itemInstanceId,
        characterId: item.characterId,
        membershipType: membershipType,
      };
      try {
        await equipItem(equipData);
        if (manifestData && manifestData.DestinyInventoryItemDefinition) {
          let itemDefinition =
            manifestData.DestinyInventoryItemDefinition[randomItem.itemHash];
          if (itemDefinition) {
            toast(
              `Equipping item: ${
                itemDefinition.displayProperties.name
              } ${getBucketName(
                randomItem.bucketHash
              )} from ${sourceCharacterId} ${item.SOURCE}`
            );
            console.log(
              `Equipping item: ${
                itemDefinition.displayProperties.name
              } ${getBucketName(
                randomItem.bucketHash
              )} from ${sourceCharacterId} ${item.SOURCE}`
            );
          } else {
            console.log(`Equipping item from somewhere`);
          }
        } else {
          console.log(`Equipping item item from somewhere`);
        }
      } catch (error) {
        console.error(`Equip to ${sourceCharacterId} failed:`, error);
      }
      //then transfer to vault
      let transferData = {
        username: membershipId,
        itemReferenceHash: item.itemHash,
        stackSize: 1,
        transferToVault: true,
        itemId: item.itemInstanceId,
        characterId: item.characterId,
        membershipType: membershipType,
      };
      try {
        await transferItem(transferData);
        if (manifestData && manifestData.DestinyInventoryItemDefinition) {
          let itemDefinition =
            manifestData.DestinyInventoryItemDefinition[item.itemHash];
          if (itemDefinition) {
            toast(
              `Transferred ${itemDefinition.displayProperties.name} to Vault`
            );
            console.log(
              `Transferred ${itemDefinition.displayProperties.name} to Vault`
            );
          } else {
            console.log(`failed`);
          }
        }
        await queryClient.invalidateQueries({
          queryKey: ["profileData", membershipId],
        });
      } catch (error) {
        console.error("Transfer to vault failed:", error);
      }
    }
  };

  return (
    <div onDrop={(e) => handleDrop(e)} onDragOver={handleDragOver}>
      {filteredItems.length > 0 && (
        <Label className="p-2" htmlFor="profile">
          ...the rest of your gear
        </Label>
      )}
      <div className="border rounded-xl flex flex-grid flex-wrap items-center justify-center gap-1 p-2">
        {filteredItems.map((item) => (
          <motion.div
            key={item.itemInstanceId}
            draggable
            onDragStart={(e) => handleDragStart(e, item, SOURCE)}
            className="item cursor-grab active:cursor-grabbing"
          >
            <Item
              itemHash={item.itemHash}
              itemInstanceId={item.itemInstanceId}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInventory;
