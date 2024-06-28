"use client";
import { Backpack } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";
import Item from "@/components/Item/item";
import { Badge } from "@/components/ui/badge";
import { useDragContext } from "@/app/hooks/useDragContext";
import { CharacterInventoryProps, InventoryItem, DraggableItem } from "@/lib/interfaces";
import {
  weaponBucketHash,
  armorBucketHash,
  bucketHash,
  itemOrder,
} from "@/lib/destinyEnums";
import { motion, AnimatePresence, PanInfo, useDragControls } from "framer-motion";

const CharacterInventory: React.FC<CharacterInventoryProps> = React.memo(({ filteredItems }) => {
  const { draggedItem, setDraggedItem, handleDrop } = useDragContext();
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);

  const dragControls = useDragControls();

  const isWeaponOrArmor = useCallback((bucketHash: number) => {
    return weaponBucketHash.includes(bucketHash) || armorBucketHash.includes(bucketHash);
  }, []);

  const handleDragStart = useCallback((item: InventoryItem, characterId: string) => {
    setDraggedItem({ ...item, characterId, SOURCE: "CharacterInventory" } as DraggableItem);
  }, [setDraggedItem]);

  const handleDragEnd = useCallback((
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!draggedItem) return;

    const dropZones = document.querySelectorAll("[data-character-id][data-inventory-type]");
    const targetDropZone = Array.from(dropZones).find((zone) => {
      const rect = zone.getBoundingClientRect();
      return (
        info.point.x >= rect.left &&
        info.point.x <= rect.right &&
        info.point.y >= rect.top &&
        info.point.y <= rect.bottom
      );
    });

    if (targetDropZone) {
      const targetCharacterId = targetDropZone.getAttribute("data-character-id");
      const targetSource = targetDropZone.getAttribute("data-inventory-type");
      if (targetCharacterId && targetSource) {
        setProcessingItems(prev => new Set(prev).add(draggedItem.itemInstanceId));
        setIsUpdating(true);
        handleDrop(targetCharacterId, targetSource).finally(() => {
          setProcessingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(draggedItem.itemInstanceId);
            return newSet;
          });
          setIsUpdating(false);
        });
      }
    }
    setDraggedItem(null);
  }, [draggedItem, handleDrop, setDraggedItem]);

  const groupItemsByBucket = useCallback((items: InventoryItem[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.bucketHash]) {
        acc[item.bucketHash] = [];
      }
      acc[item.bucketHash].push(item);
      return acc;
    }, {} as Record<number, InventoryItem[]>);
  }, []);

  const renderedInventories = useMemo(() => (
    Object.entries(filteredItems).map(([characterId, characterInventory]) => (
      <motion.div
        key={characterId}
        className="flex-1 p-1 border rounded-xl"
        data-character-id={characterId}
        data-inventory-type="CharacterInventory"
      >
        {Object.entries(groupItemsByBucket(characterInventory.items))
          .sort(([a], [b]) => itemOrder.indexOf(Number(a)) - itemOrder.indexOf(Number(b)))
          .map(([bucketHashStr, bucketItems]) => {
            const bucketHashNum = Number(bucketHashStr);
            if (isWeaponOrArmor(bucketHashNum)) {
              return (
                <div key={bucketHashStr} className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold">
                      {bucketHash[bucketHashNum] || "Unknown"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {bucketItems.length}/9
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-0.5">
                    <AnimatePresence>
                      {bucketItems.map((item) => (
                        <motion.div
                          key={`${characterId}-${item.itemInstanceId}`}
                          drag
                          dragControls={dragControls}
                          onDragStart={() => handleDragStart(item, characterId)}
                          onDragEnd={handleDragEnd}
                          whileDrag={{ scale: 1.1, zIndex: 1 }}
                          className="item cursor-grab active:cursor-grabbing"
                          initial={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                          animate={processingItems.has(item.itemInstanceId) ? { opacity: 0.5 } : { opacity: 1 }}
                        >
                          <Item
                            itemHash={item.itemHash}
                            itemInstanceId={item.itemInstanceId}
                            characterId={characterId}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            }
            return null;
          })}
      </motion.div>
    ))
  ), [filteredItems, groupItemsByBucket, isWeaponOrArmor, handleDragStart, handleDragEnd, processingItems, dragControls]);

  return (
    <>
      <Backpack className="pl-2" />
      {isUpdating && <div>Updating inventory...</div>}
      <div className="flex flex-row gap-2 pt-1">
        {renderedInventories}
      </div>
    </>
  );
});

export default CharacterInventory;