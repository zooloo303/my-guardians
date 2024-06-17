"use client";
import Item from "@/components/Item/item";
import { Label } from "@/components/ui/label"
import { ProfileData } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import {
  subclassBucketHash,
  armorBucketHash,
  weaponBucketHash,
} from "@/lib/destinyEnums";

const CharacterEquipment: React.FC = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);

  if (isLoading) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const equipmentData = data?.Response.characterEquipment.data;

  if (!equipmentData) {
    return <div className="hidden">No profile data found</div>; // Subtle empty state
  }

  return (
    <>
      <Label className="pl-2"
        htmlFor="equipped">Equipped Items</Label>
    <div className="flex flex-row justify-between items-center gap-2">
      {Object.entries(equipmentData).map(
        ([characterId, characterEquipment]) => (
          <div key={characterId} className="w-1/3 border p-2 rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {characterEquipment.items
                .filter((item) => subclassBucketHash.includes(item.bucketHash))
                .map((item) => (
                  <Item
                    key={item.itemInstanceId}
                    itemHash={item.itemHash}
                    itemInstanceId={item.itemInstanceId}
                  />
                ))}
            </div>
            <div className="pt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {characterEquipment.items
                .filter((item) => weaponBucketHash.includes(item.bucketHash))
                .map((item) => (
                  <Item
                    key={item.itemInstanceId}
                    itemHash={item.itemHash}
                    itemInstanceId={item.itemInstanceId}
                  />
                ))}
            </div>
            <div className="pt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {characterEquipment.items
                .filter((item) => armorBucketHash.includes(item.bucketHash))
                .map((item) => (
                  <Item
                    key={item.itemInstanceId}
                    itemHash={item.itemHash}
                    itemInstanceId={item.itemInstanceId}
                  />
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
