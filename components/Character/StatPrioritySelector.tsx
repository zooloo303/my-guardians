// components/StatPrioritySelector.tsx
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SkeletonGuy } from "@/components/skeleton";
import { SortableStatProps } from "@/lib/interfaces";
import { defaultStatOrder } from "@/lib/destinyEnums";
import { useManifestData } from "@/app/hooks/useManifest";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableStat: React.FC<SortableStatProps> = ({ id, icon, name }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Badge className="flex items-center justify-between rounded-md mb-2 cursor-move overflow-hidden">
        <span className="flex items-center gap-2 whitespace-nowrap text-overflow-ellipsis overflow-hidden">
          <Image
            src={`https://www.bungie.net${icon}`}
            alt={`${name} icon`}
            width={35}
            height={24}
          />
          {name}
        </span>
      </Badge>
    </div>
  );
};

const StatPrioritySelector: React.FC = () => {
  const { data: manifestData } = useManifestData();
  const [statOrder, setStatOrder] = useState<string[]>(defaultStatOrder);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!manifestData) {
    return <SkeletonGuy />;
  }

  const statDefinitions = manifestData.DestinyStatDefinition;
  if (!statDefinitions) {
    return <div>Stat definitions not found</div>;
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setStatOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="max-w-lg p-2">
      <h2 className="text-lg mb-4">Stat Priority</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={statOrder}
          strategy={verticalListSortingStrategy}
        >
          {statOrder.map((hash) => (
            <SortableStat
              key={hash}
              id={hash}
              icon={statDefinitions[hash].displayProperties.icon}
              name={statDefinitions[hash].displayProperties.name}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default StatPrioritySelector;
