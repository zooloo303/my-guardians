"use client";
import Item from "@/components/Item/item";
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
    <div className="flex flex-row justify-between items-center gap-4">
      {Object.entries(equipmentData).map(
        ([characterId, characterEquipment]) => (
          <div key={characterId} className="w-1/3 border p-4 rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
  );
};

export default CharacterEquipment;