import { toast } from "sonner";
import { motion } from "framer-motion";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { equipItem, transferItem } from "@/lib/transferUtils";
import { useAuthContext } from "@/components/Auth/AuthContext";
import {
  CharacterInventoryProps,
  EquipData,
  TransferData,
} from "@/lib/interfaces";
import {
  armorBucketHash,
  weaponBucketHash,
  bucketHash,
  classes,
  races,
} from "@/lib/destinyEnums";

const CharacterInventory: React.FC<CharacterInventoryProps> = ({
  filteredItems,
}) => {
  const SOURCE = "CharacterInventory";
  const queryClient = useQueryClient();
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData } = useProfileData(membershipId);

  const isWeaponOrArmor = (bucketHash: number) => {
    return (
      weaponBucketHash.includes(bucketHash) ||
      armorBucketHash.includes(bucketHash)
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
    return "vault";
  };
  const getBucketName = (hash: number): string => {
    return bucketHash[hash] || "Unknown Bucket";
  };
  const getRandomItem = (characterId: string, bucketType: number) => {
    return profileData.Response.characterInventories.data[
      characterId
    ].items.find((item: any) => item.bucketHash === bucketType);
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
        console.log(
          `Dragging item: ${
            itemData.displayProperties.name
          } from ${getCharacterInfo(characterId)}`
        );
      } else {
        console.log(
          `Dragging item: Unknown item from ${getCharacterInfo(characterId)}`
        );
      }
    } else {
      console.log(
        `Dragging item: Unknown item from ${getCharacterInfo(characterId)}`
      );
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
    //if item SOURCE = CharacterEquipment, equip random item,
    if (
      item &&
      membershipId &&
      item.SOURCE === "CharacterEquipment" &&
      item.characterId === characterId
    ) {
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
    }
    //if item SOURCE = different CharacterEquipment, equip random item,
    //then transfer to vault, then transfer to target character
    if (
      item &&
      membershipId &&
      item.SOURCE === "CharacterEquipment" &&
      item.characterId !== characterId
    ) {
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
      //transfer to vault
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
      transferData = {
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
    }
    //if item SOURCE = different CharacterInventory, transfer to vault,
    //then transfer to target character
    if (
      item &&
      membershipId &&
      item.SOURCE === "CharacterInventory" &&
      item.characterId !== characterId
    ) {
      //transfer to vault
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
      transferData = {
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
    }
    //if item SOURCE = ProfileInventory, transfer to target character
    if (
      item &&
      membershipId &&
      item.SOURCE === "ProfileInventory" 
    ) {
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

    }

  };

  return (
    <>
      <Label className="pl-2 pb-1" htmlFor="character">
        Character Inventory
      </Label>
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
                      onDragStart={(e) =>
                        handleDragStart(e, item, characterId, SOURCE)
                      }
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
