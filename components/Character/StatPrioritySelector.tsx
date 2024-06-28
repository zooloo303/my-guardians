// components/StatPrioritySelector.tsx
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SkeletonGuy } from "@/components/skeleton";
import { SortableStatProps } from "@/lib/interfaces";
import { defaultStatOrder } from "@/lib/destinyEnums";
import { useManifestData } from "@/app/hooks/useManifest";
import { Reorder } from "framer-motion";
import { Card, CardContent, CardHeader } from "../ui/card";

const SortableStat: React.FC<SortableStatProps> = ({ id, icon, name }) => {
  return (
    <Reorder.Item value={id} id={id}>
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
    </Reorder.Item>
  );
};

const StatPrioritySelector: React.FC = () => {
  const { data: manifestData } = useManifestData();
  const [statOrder, setStatOrder] = useState<string[]>(defaultStatOrder);

  if (!manifestData) {
    return <SkeletonGuy />;
  }

  const statDefinitions = manifestData.DestinyStatDefinition;
  if (!statDefinitions) {
    return <div>Stat definitions not found</div>;
  }

  return (
    <Card className="max-w-lg p-2">
      <CardHeader className="items-center">Stat Priority</CardHeader>
      <CardContent>
      <Reorder.Group axis="y" values={statOrder} onReorder={setStatOrder}>
        {statOrder.map((hash) => (
          <SortableStat
            key={hash}
            id={hash}
            icon={statDefinitions[hash].displayProperties.icon}
            name={statDefinitions[hash].displayProperties.name}
          />
        ))}
      </Reorder.Group>
      </CardContent>
    </Card>
  );
};

export default StatPrioritySelector;