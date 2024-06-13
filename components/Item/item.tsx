import React from "react";
import { useManifestData } from "@/app/hooks/useManifest";

interface ItemProps {
  itemHash: number;
}

const Item: React.FC<ItemProps> = ({ itemHash }) => {
  const { data: manifestData } = useManifestData();

  if (!manifestData) {
    return null; // Or a loading spinner
  }

  const itemData = manifestData.DestinyInventoryItemDefinition[itemHash];

  if (!itemData) {
    return <div>Item data not found</div>;
  }

  return (
    <div className="flex flex-col items-center p-2 border rounded-md">
      <img
        src={`https://www.bungie.net${itemData.displayProperties.icon}`}
        alt={itemData.displayProperties.name}
        className="w-16 h-16 mb-2"
      />
      <span className="text-center">{itemData.displayProperties.name}</span>
    </div>
  );
};

export default Item;
