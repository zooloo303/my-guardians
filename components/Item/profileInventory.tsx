"use client";
import { Vault } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";
import Item from "@/components/Item/item";
import { Badge } from "@/components/ui/badge";
import { useDragContext } from "@/app/hooks/useDragContext";
import { useManifestData } from "@/app/hooks/useManifest";
import { ProfileInventoryProps, InventoryItem, DraggableItem } from "@/lib/interfaces";
import { motion, AnimatePresence, PanInfo, useDragControls } from "framer-motion";

const ProfileInventory: React.FC<ProfileInventoryProps> = React.memo(({ filteredItems }) => {
  const { draggedItem, setDraggedItem, handleDrop } = useDragContext();
  const { data: manifestData } = useManifestData();
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);

  const dragControls = useDragControls();

  const handleDragStart = useCallback((item: InventoryItem) => {
    setDraggedItem({ ...item, characterId: "", SOURCE: "ProfileInventory" } as DraggableItem);
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

  const totalItems = useMemo(() => filteredItems.length, [filteredItems]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const itemA = manifestData?.DestinyInventoryItemDefinition[a.itemHash];
      const itemB = manifestData?.DestinyInventoryItemDefinition[b.itemHash];
      return (itemA?.itemTypeDisplayName || "").localeCompare(itemB?.itemTypeDisplayName || "");
    });
  }, [filteredItems, manifestData]);

  const renderedItems = useMemo(() => (
    <AnimatePresence>
      {sortedItems.map((item) => (
        <motion.div
          key={item.itemInstanceId}
          drag
          dragControls={dragControls}
          onDragStart={() => handleDragStart(item)}
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
          />
        </motion.div>
      ))}
    </AnimatePresence>
  ), [sortedItems, handleDragStart, handleDragEnd, processingItems, dragControls]);

  return (
    <>
      <div className="flex flex-row p-1 items-center">
        <Vault className="pl-2" />
        <span className="font-bold ml-2">Vault</span>
        <Badge variant="outline" className="ml-2 text-xs">
          {totalItems}/700
        </Badge>
      </div>
      {isUpdating && <div>Updating inventory...</div>}
      <motion.div
        className="border rounded-xl flex flex-wrap items-top justify-center gap-1 p-2 mb-2"
        data-character-id="vault"
        data-inventory-type="ProfileInventory"
      >
        {renderedItems}
      </motion.div>
    </>
  );
});

ProfileInventory.displayName = 'ProfileInventory';

export default React.memo(ProfileInventory);