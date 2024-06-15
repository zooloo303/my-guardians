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
  unwantedBucketHash,
  itemOrder, // Import itemOrder
} from "@/lib/destinyEnums";

interface InventoryItem {
  bucketHash: number;
  itemHash: number;
  itemInstanceId: string;
}

const CharacterInventory: React.FC = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);

  if (isLoading) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const inventoryData = data?.Response.characterInventories.data;

  if (!inventoryData) {
    return <div className="hidden">No profile data found</div>; // Subtle empty state
  }

  const sortItems = (items: InventoryItem[]): InventoryItem[] => {
    return items
      .filter((item) => !unwantedBucketHash.includes(item.bucketHash))
      .sort(
        (a, b) =>
          itemOrder.indexOf(a.bucketHash) - itemOrder.indexOf(b.bucketHash)
      );
  };

  return (
    <div className="flex flex-row justify-between gap-1">
      {Object.entries(inventoryData).map(
        ([characterId, characterInventories]) => (
          <div key={characterId} className="w-1/3 p-1 rounded-md">
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1">
              {sortItems(characterInventories.items).filter((item) =>
                subclassBucketHash.includes(item.bucketHash)
              ).map((item) => (
                <Item
                  key={item.itemInstanceId}
                  itemHash={item.itemHash}
                  itemInstanceId={item.itemInstanceId}
                />
              ))}
            </div>
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 mt-1">
              {sortItems(characterInventories.items).filter((item) =>
                weaponBucketHash.includes(item.bucketHash)
              ).map((item) => (
                <Item
                  key={item.itemInstanceId}
                  itemHash={item.itemHash}
                  itemInstanceId={item.itemInstanceId}
                />
              ))}
            </div>
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 mt-1">
              {sortItems(characterInventories.items).filter((item) =>
                armorBucketHash.includes(item.bucketHash)
              ).map((item) => (
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

export default CharacterInventory;
