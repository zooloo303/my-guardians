// hooks/useItemOperations.ts
import { useManifestData } from '@/app/hooks/useManifest';
import { useProfileData } from '@/app/hooks/useProfileData';
import { useAuthContext } from '@/components/Auth/AuthContext';
import { transferItem, equipItem } from '@/lib/transferUtils';
import { toast } from "sonner";
import { InventoryItem, TransferData, EquipData } from "@/lib/interfaces";
import { getBucketName } from "@/lib/inventoryUtils";

export const useItemOperations = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData } = useProfileData(membershipId);
  const { data: manifestData } = useManifestData();

  const getItemName = (item: InventoryItem) => {
    if (manifestData?.DestinyInventoryItemDefinition) {
      const itemDefinition = manifestData.DestinyInventoryItemDefinition[item.itemHash];
      return itemDefinition ? itemDefinition.displayProperties.name : "Unknown Item";
    }
    return "Unknown Item";
  };

  const transfer = async (item: InventoryItem, toVault: boolean, characterId: string, membershipType: number) => {
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
        const location = toVault ? "vault" : "character inventory";
        toast(`Transferred ${itemName} to ${location}`);
      } catch (error) {
        console.error("Transfer failed:", error);
        toast(`Failed to transfer item`, { style: { backgroundColor: 'red', color: 'white' } });
      }
    };
  
    const equip = async (item: InventoryItem, characterId: string, membershipType: number) => {
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
        toast(`Equipped ${itemName}`);
      } catch (error) {
        console.error("Equip failed:", error);
        toast(`Failed to equip item`, { style: { backgroundColor: 'red', color: 'white' } });
      }
    };

  const getRandomItem = (characterId: string, bucketType: number): InventoryItem | undefined => {
    return profileData?.Response.characterInventories.data[characterId]?.items.find(
      (item: InventoryItem) => item.bucketHash === bucketType
    );
  };

  return { transfer, equip, getRandomItem };
};