"use client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { ProfileData } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { equipItem, transferItem } from "@/lib/transferUtils";
import { useAuthContext } from "@/components/Auth/AuthContext";
import CharacterSubclass from "../Character/characterSubclass";
import {
  armorBucketHash,
  weaponBucketHash,
  bucketHash,
  classes,
  races,
} from "@/lib/destinyEnums";
import {
  EquipData,
  TransferData,
  CharacterEquipmentProps,
} from "@/lib/interfaces";

const CharacterEquipment: React.FC<CharacterEquipmentProps> = ({
  showSubclass,
}) => {
  const SOURCE = "CharacterEquipment";
  const queryClient = useQueryClient();
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();

  if (isLoading) {
    return <SkeletonGuy />;
  }
  const data = profileData as unknown as ProfileData | null;
  const equipmentData = data?.Response.characterEquipment.data;

  if (!equipmentData || !membershipId) {
    return <div className="hidden">No profile data found</div>;
  }
  const getCharacterInfo = (characterId: string) => {
    const character = profileData?.Response.characters.data?.[characterId];
    if (character) {
      return `${classes[character.classType]}, ${races[character.raceType]}`;
    }
    return "the Vault";
  };
  const getBucketName = (hash: number): string => {
    return bucketHash[hash] || "Unknown Bucket";
  };
  const handleDragStart = (
    e: any,
    item: any,
    characterId: string,
    SOURCE: string
  ) => {
    const itemWithCharacterId = { ...item, characterId, SOURCE };
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify(itemWithCharacterId)
    );
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (characterId: string, e: React.DragEvent) => {
    e.preventDefault();
    const membershipType: number =
      profileData?.Response.profile.data.userInfo.membershipType;
    const droppedItem = e.dataTransfer.getData("application/json");
    const sourceCharacterId = getCharacterInfo(
      JSON.parse(droppedItem).characterId
    );  
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
      //if item SOURCE = same CharacterInventory, equip item on target character
      if (item && membershipId && item.SOURCE === "CharacterInventory" && item.characterId === characterId) {
        let equipData: EquipData = {
          username: membershipId,
          itemId: item.itemInstanceId,
          characterId: item.characterId,
          membershipType: membershipType,
        };
        try {
          await equipItem(equipData);
          if (manifestData && manifestData.DestinyInventoryItemDefinition) {
            let itemDefinition =
              manifestData.DestinyInventoryItemDefinition[item.itemHash];
            if (itemDefinition) {
              toast(
                `Equipped item ${itemDefinition.displayProperties.name} on ${getCharacterInfo(characterId)}`
              );
              console.log(
                `Equipped item${
                  itemDefinition.displayProperties.name
                } ${getBucketName(item.bucketHash)} from ${sourceCharacterId}${
                  item.SOURCE
                }`
              );
            } else {
              console.log(`Equip failed`);
            }
          } else {
            console.log(`Equip failed`);
          }
          await queryClient.invalidateQueries({
            queryKey: ["profileData", membershipId],
          });
        } catch (error) {
          console.error("Equip failed:", error);
        }
      }
      //if item SOURCE = different CharacterInventory, vault first,
      //then transfer to target character, then equip item on target character

      if (item && membershipId && item.SOURCE === "CharacterInventory"
         && item.characterId !== characterId) {
          //vault first
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
          //transfer to target character
          transferData ={
            username: membershipId,
            itemReferenceHash: item.itemHash,
            stackSize: 1,
            transferToVault: false,
            itemId: item.itemInstanceId,
            characterId: characterId,
            membershipType: membershipType,
          };
          try {
            await transferItem(transferData);
            if (manifestData && manifestData.DestinyInventoryItemDefinition) {
              let itemDefinition =
                manifestData.DestinyInventoryItemDefinition[item.itemHash];
              if (itemDefinition) {
                toast(
                  `Transferred ${itemDefinition.displayProperties.name} to the character`
                );
                console.log(
                  `Transferred ${
                    itemDefinition.displayProperties.name
                  } ${getBucketName(item.bucketHash)} from ${sourceCharacterId} ${
                    item.SOURCE
                  } to character`
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
          let equipData: EquipData = {
            username: membershipId,
            itemId: item.itemInstanceId,
            characterId: characterId,
            membershipType: membershipType,
          };
          try {
            await equipItem(equipData);
            if (manifestData && manifestData.DestinyInventoryItemDefinition) {
              let itemDefinition =
                manifestData.DestinyInventoryItemDefinition[item.itemHash];
              if (itemDefinition) {
                toast(
                  `Equipped item ${itemDefinition.displayProperties.name} on ${getCharacterInfo(characterId)}`
                );
                console.log(
                  `Equipped item${
                    itemDefinition.displayProperties.name
                  } ${getBucketName(item.bucketHash)} from ${getCharacterInfo(characterId)}${
                    item.SOURCE
                  }`
                );
              } else {
                console.log(`Equip failed`);
              }
            } else {
              console.log(`Equip failed`);
            }
            await queryClient.invalidateQueries({
              queryKey: ["profileData", membershipId],
            });
          } catch (error) {
            console.error("Equip failed:", error);
          }
      }
      //if item SOURCE = Profilenventory, then transfer to target character,
      //then equip item on target character
    if (item && membershipId && item.SOURCE === "ProfileInventory") {
      //transfer to target character
      let transferData = {
        username: membershipId,
        itemReferenceHash: item.itemHash,
        stackSize: 1,
        transferToVault: false,
        itemId: item.itemInstanceId,
        characterId: characterId,
        membershipType: membershipType,
      };
      console.log("transferData: ", transferData);
      try {
        await transferItem(transferData);
        if (manifestData && manifestData.DestinyInventoryItemDefinition) {
          let itemDefinition =
            manifestData.DestinyInventoryItemDefinition[item.itemHash];
          if (itemDefinition) {
            toast(
              `Transferred ${itemDefinition.displayProperties.name} to the character`
            );
            console.log(
              `Transferred ${
                itemDefinition.displayProperties.name
              } ${getBucketName(item.bucketHash)} from ${sourceCharacterId} ${
                item.SOURCE
              } to character`
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
      let equipData: EquipData = {
        username: membershipId,
        itemId: item.itemInstanceId,
        characterId: characterId,
        membershipType: membershipType,
      };
      try {
        await equipItem(equipData);
        if (manifestData && manifestData.DestinyInventoryItemDefinition) {
          let itemDefinition =
            manifestData.DestinyInventoryItemDefinition[item.itemHash];
          if (itemDefinition) {
            toast(
              `Equipped item ${itemDefinition.displayProperties.name} on ${getCharacterInfo(characterId)}`
            );
            console.log(
              `Equipped item ${
                itemDefinition.displayProperties.name
              } ${getBucketName(item.bucketHash)} from ${getCharacterInfo(characterId)} ${
                item.SOURCE
              }`
            );
          } else {
            console.log(`Equip failed`);
          }
        } else {
          console.log(`Equip failed`);
        }
        await queryClient.invalidateQueries({
          queryKey: ["profileData", membershipId],
        });
      } catch (error) {
        console.error("Equip failed:", error);
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
                      onDragStart={(e) =>
                        handleDragStart(e, item, characterId, SOURCE)
                      }
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
                      onDragStart={(e) =>
                        handleDragStart(e, item, characterId, SOURCE)
                      }
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
