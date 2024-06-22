import { Socket } from "@/lib/interfaces";
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

  const itemData = manifestData.DestinyInventoryItemDefinition[itemHash];
  if (!itemData) {
    return null;
  }

  const instanceData = profileData.Response.itemComponents.instances.data[itemInstanceId];
  const primaryStatValue = instanceData?.primaryStat?.value;
  const damageType = instanceData?.damageType;
  const socketData = profileData.Response.itemComponents.sockets.data[itemInstanceId];
  const sockets: Socket[] = socketData?.sockets ?? [];
  const statData = profileData.Response.itemComponents.stats.data[itemInstanceId]?.stats ?? {};

  const damageTypeIcon = damageType ? defaultDamageType[damageType] : null;
  const shouldShowPrimaryStat = itemData.itemType === 2 || itemData.itemType === 3; // 2: Armor, 3: Weapon

  return {
    itemData,
    primaryStatValue,
    damageTypeIcon,
    shouldShowPrimaryStat,
    sockets,
    statData,
    manifestData
  };
};