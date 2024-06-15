"use client";
import Item from "@/components/Item/item";

interface InventoryItem {
  bucketHash: number;
  itemHash: number;
  itemInstanceId: string;
}

interface ProfileInventoryProps {
  filteredItems: InventoryItem[];
}

const ProfileInventory: React.FC<ProfileInventoryProps> = ({ filteredItems }) => {
  return (
    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-16 3xl:grid-cols-18 4xl:grid-cols-20 gap-1 p-2">
      {filteredItems.map((item) => (
        <Item
          key={item.itemInstanceId} // Ensuring unique key
          itemHash={item.itemHash}
          itemInstanceId={item.itemInstanceId}
        />
      ))}
    </div>
  );
};

export default ProfileInventory;
