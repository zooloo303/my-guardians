// hooks/useItemOperations.ts
import { toast } from "sonner";
import { classes, races } from "@/lib/destinyEnums";
import { useQueryClient } from "@tanstack/react-query";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { transferItem, equipItem, equipItems } from "@/lib/transferUtils";
import { InventoryItem, TransferData, EquipData, EquipDataMulti } from "@/lib/interfaces";

export const useItemOperations = () => {
  const { membershipId } = useAuthContext();
  const queryClient = useQueryClient();
  const { data: profileData } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();

  const getItemName = (item: InventoryItem) => {
    if (manifestData?.DestinyInventoryItemDefinition) {
      const itemDefinition =
        manifestData.DestinyInventoryItemDefinition[item.itemHash];
      return itemDefinition
        ? itemDefinition.displayProperties.name
        : "Unknown Item";
    }
    return "Unknown Item";
  };

  const getCharacterInfo = (characterId: string) => {
    const character = profileData?.Response.characters.data?.[characterId];
    if (character) {
      return `${races[character.raceType]} ${classes[character.classType]}`;
    }
    return "Unknown Character";
  };

  const transfer = async (
    item: InventoryItem,
    toVault: boolean,
    characterId: string,
    membershipType: number
  ) => {
    if (!membershipId) return;

    const transferData: TransferData = {
      username: membershipId,
      itemReferenceHash: item.itemHash,
      stackSize: 1,
      transferToVault: toVault,
      itemId: item.itemInstanceId,
      characterId: characterId,
      membershipType: membershipType,
    };

    try {
      await transferItem(transferData);
      const itemName = getItemName(item);
      const characterInfo = getCharacterInfo(characterId);
      const location = toVault ? "vault" : `${characterInfo}'s inventory`;
      toast(`Transferred ${itemName} to ${location}`);
      queryClient.invalidateQueries({ queryKey: ["profileData"] });
    } catch (error) {
      console.error("Transfer failed:", error);
      toast(`Failed to transfer item`, {
        style: { backgroundColor: "red", color: "white" },
      });
    }
  };

  const equip = async (
    item: InventoryItem,
    characterId: string,
    membershipType: number
  ) => {
    if (!membershipId) return;

    const equipData: EquipData = {
      username: membershipId,
      itemId: item.itemInstanceId,
      characterId: characterId,
      membershipType: membershipType,
    };

    try {
      await equipItem(equipData);
      const itemName = getItemName(item);
      const characterInfo = getCharacterInfo(characterId);
      toast(`Equipped ${itemName} on ${characterInfo}`);
      queryClient.invalidateQueries({ queryKey: ["profileData"] });
    } catch (error) {
      console.error("Equip failed:", error);
      toast(`Failed to equip item`, {
        style: { backgroundColor: "red", color: "white" },
      });
    }
  };
  
  // In useItemOperations.ts
const equipMultipleItems = async (
  itemIds: string[],
  characterId: string,
  membershipType: number
) => {
  if (!membershipId) return;

  const equipDataMulti: EquipDataMulti = {
    username: membershipId,
    itemIds: itemIds,
    characterId: characterId,
    membershipType: membershipType,
  };

  try {
    await equipItems(equipDataMulti);
    toast(`Equipped ${itemIds.length} items`);
    queryClient.invalidateQueries({ queryKey: ["profileData"] });
  } catch (error) {
    console.error("Equip multiple items failed:", error);
    toast(`Failed to equip items`, {
      style: { backgroundColor: "red", color: "white" },
    });
  }
};

  const getRandomItem = (
    characterId: string,
    bucketType: number
  ): InventoryItem | undefined => {
    return profileData?.Response.characterInventories.data[
      characterId
    ]?.items.find((item: InventoryItem) => item.bucketHash === bucketType);
  };

  return { transfer, equip, getRandomItem, equipMultipleItems };
};