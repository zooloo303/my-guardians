// components/SubclassSelector.tsx

import React, { useState } from 'react';
import Image from 'next/image';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubclassSelectorProps {
  onSubclassChange: (subclass: string) => void;
}

interface Subclass {
  name: string;
  icon: string;
}

const subclasses: Subclass[] = [
  { name: "Solar", icon: "/subclass-solar.png" },
  { name: "Arc", icon: "/subclass-arc.png" },
  { name: "Void", icon: "/subclass-void.png" },
  { name: "Stasis", icon: "/subclass-stasis.png" },
  { name: "Strand", icon: "/subclass-strand.png" },
  { name: "Prismatic", icon: "/subclass-prismatic.png" },
];

const SubclassSelector: React.FC<SubclassSelectorProps> = ({ onSubclassChange }) => {
  const [selectedSubclass, setSelectedSubclass] = useState<string | null>(null);

  const handleSubclassChange = (value: string) => {
    setSelectedSubclass(value);
    onSubclassChange(value);
  };

  return (
    <TooltipProvider>
      <ToggleGroup 
        type="single"
        value={selectedSubclass || ""}
        onValueChange={handleSubclassChange}
        className="flex justify-center space-x-2"
      >
        {subclasses.map((subclass) => (
          <Tooltip key={subclass.name}>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value={subclass.name}
                aria-label={`Select ${subclass.name}`}
                className={`p-2 ${selectedSubclass === subclass.name ? 'bg-slate-700' : ''}`}
              >
                <Image 
                  src={subclass.icon}
                  alt={subclass.name}
                  width={40}
                  height={40}
                />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>{subclass.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  );
};

export default SubclassSelector;