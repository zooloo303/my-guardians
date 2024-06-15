import { Progress } from "@/components/ui/progress";
import { Stat, StatsProps } from "@/lib/interfaces";


const Stats: React.FC<StatsProps> = ({ stats, manifestData }) => {
  return (
    <div className="mt-2">
      {Object.entries(stats).map(([statHash, statValue]) => {
        const value = (statValue as Stat).value;
        const statDef = manifestData.DestinyStatDefinition[statHash];
        return (
          <div key={statHash} className="mb-1">
            <div className="flex justify-between text-xs text-white mb-1">
              <span className="truncate">{statDef.displayProperties.name}</span>
              <span>{value}</span>
            </div>
            <Progress value={value} className="w-full h-1.5" />
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
