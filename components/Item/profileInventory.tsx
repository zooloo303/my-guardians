"use client";
import Item from "@/components/Item/item";
import { ProfileData } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import {
  unwantedBucketHash,
  itemOrder, 
} from "@/lib/destinyEnums";

interface InventoryItem {
  bucketHash: number;
  itemHash: number;
  itemInstanceId: string;
}

const ProfileInventory: React.FC = () => {
  const { membershipId } = useAuthContext();
  const { data: profileData, isLoading } = useProfileData(membershipId);

  if (isLoading) {
    return <SkeletonGuy />;
  }

  const data = profileData as unknown as ProfileData | null;
  const inventoryData = data?.Response.profileInventory.data.items;

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
    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-16 3xl:grid-cols-18 4xl:grid-cols-20 p-1">
      {sortItems(inventoryData).map((item) => (
        <Item
          key={item.itemInstanceId}
          itemHash={item.itemHash}
          itemInstanceId={item.itemInstanceId}
        />
      ))}
    </div>
  );
};

export default ProfileInventory;
