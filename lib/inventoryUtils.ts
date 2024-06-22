import { toast } from "sonner";
import { classes, races, bucketHash } from "@/lib/destinyEnums";
import { CharacterType, InventoryItem, ManifestData } from "@/lib/interfaces";

export const getCharacterInfo = (character: CharacterType) => {
  return `${classes[character.classType]}, ${races[character.raceType]}`;
};

export const getBucketName = (hash: number): string => {
  return bucketHash[hash] || "Unknown Bucket";
};

export const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: InventoryItem, source: string) => {
    const itemWithSource = { ...item, SOURCE: source };
    e.dataTransfer.setData("application/json", JSON.stringify(itemWithSource));
    e.dataTransfer.effectAllowed = "move";
  };

export const logAndToast = (message: string, manifestData: ManifestData | undefined, item: InventoryItem) => {
    if (manifestData?.DestinyInventoryItemDefinition) {
      const itemDefinition = manifestData.DestinyInventoryItemDefinition[item.itemHash];
      if (itemDefinition) {
        const fullMessage = `${message} ${itemDefinition.displayProperties.name} ${getBucketName(item.bucketHash)}`;
        toast(fullMessage);
        console.log(fullMessage);
      } else {
        console.log("Unknown item");
      }
    } else {
      console.log("Manifest data not available");
    }
  };