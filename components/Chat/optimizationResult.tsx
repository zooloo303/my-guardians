import React, { useState } from 'react';
import Image from "next/image";
import Item from '@/components/Item/item';
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface OptimizationResultProps {
  result: {
    armor_pieces: any[];
    fragments: any[];
    mods: any[];
    total_stats: Record<string, number>;
    explanation: string;
  };
}

const statIcons: Record<string, string> = {
  mobility: "/mobility.png",
  resilience: "/resilience.png",
  recovery: "/recovery.png",
  discipline: "/discipline.png",
  intellect: "/intellect.png",
  strength: "/strength.png",
};

const OptimizationResult: React.FC<OptimizationResultProps> = ({ result }) => {
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);

  return (
    <div className="bg-gray-800 p-2 rounded-lg text-white text-sm">
      <div className="grid grid-cols-5 gap-1 mb-2">
        {result.armor_pieces.map((piece) => (
          <Item 
            key={piece.instanceId}
            itemHash={piece.item_hash} 
            itemInstanceId={piece.instanceId} 
          />
        ))}
      </div>
      <div className="flex justify-between mb-2">
        <div className="grid grid-cols-3 gap-1">
          {result.fragments.map((fragment) => (
            <Item 
              key={fragment.item_hash}
              itemHash={fragment.item_hash} 
              itemInstanceId={fragment.item_hash} 
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {result.mods.map((mod) => (
            <Item 
              key={mod.item_hash}
              itemHash={mod.item_hash} 
              itemInstanceId={mod.item_hash} 
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {Object.entries(result.total_stats).map(([stat, value]) => (
          <Badge
            key={stat}
            className="flex items-center justify-between rounded-md px-2 py-1"
          >
            <Image
              src={statIcons[stat.toLowerCase()] || "/default-stat-icon.svg"}
              alt={`${stat} icon`}
              width={16}
              height={16}
            />
            <span className="ml-1">{value}</span>
          </Badge>
        ))}
      </div>
      <div className="bg-gray-700 p-2 rounded">
        <button 
          className="flex items-center justify-between w-full"
          onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
        >
          <span>Explanation</span>
          {isExplanationExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {isExplanationExpanded && (
          <div className="mt-2 max-h-20 overflow-y-auto">
            {result.explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizationResult;