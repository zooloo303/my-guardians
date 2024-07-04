import { Socket, ProfileData, InventoryItem, ItemDefinition } from "@/lib/interfaces";
import { defaultDamageType } from "@/lib/destinyEnums";
import { useManifestData } from "@/app/hooks/useManifest";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";

export const useItemData = (itemHash: number, itemInstanceId: string) => {
  const { membershipId } = useAuthContext();
  const { data: manifestData } = useManifestData();
  const { data: profileData } = useProfileData(membershipId);

  if (!manifestData || !profileData) {
    return null;
  }

  const itemData = manifestData.DestinyInventoryItemDefinition[itemHash] as ItemDefinition;
  if (!itemData) {
    return null;
  }
  const typedProfileData = profileData as ProfileData;
  const instanceData = typedProfileData.Response.itemComponents.instances.data[itemInstanceId];
  const allItems: InventoryItem[] = [
    ...typedProfileData.Response.profileInventory.data.items,
    ...Object.values(typedProfileData.Response.characterInventories.data).flatMap(char => char.items),
    ...Object.values(typedProfileData.Response.characterEquipment.data).flatMap(char => char.items)
  ];
  const inventoryItem = allItems.find(item => item.itemInstanceId === itemInstanceId);
  const overrideStyleItemHash = inventoryItem?.overrideStyleItemHash;
  const overrideItemData = overrideStyleItemHash ? manifestData.DestinyInventoryItemDefinition[overrideStyleItemHash] as ItemDefinition : null;
  const primaryStatValue = instanceData?.primaryStat?.value;
  const damageType = (instanceData as any)?.damageType;
  const socketData = typedProfileData.Response.itemComponents.sockets?.data?.[itemInstanceId];
  const sockets: Socket[] = socketData?.sockets ?? [];
  const statData = typedProfileData.Response.itemComponents.stats?.data?.[itemInstanceId]?.stats ?? {};
  const damageTypeIcon = damageType ? defaultDamageType[damageType] : null;
  const shouldShowPrimaryStat = itemData.itemType === 2 || itemData.itemType === 3;
  const screenshot = overrideItemData?.screenshot || itemData.screenshot;

  return {
    itemData,
    primaryStatValue,
    damageTypeIcon,
    shouldShowPrimaryStat,
    sockets,
    statData,
    manifestData,
    overrideStyleItemHash,
    screenshot
  };
};