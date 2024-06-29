import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatPrioritySelector from './StatPrioritySelector';
import SubclassSelector from './SubclassSelector';
import { BuildPrefsProps } from "@/lib/interfaces";

const BuildPrefs: React.FC<BuildPrefsProps> = ({ 
  characterId, 
  onStatPrioritiesChange, 
  onSubclassSelect 
}) => {
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>Choose Build Preferences</CardHeader>
      <CardContent className="flex flex-row items-center space-x-6">
        <StatPrioritySelector onPrioritiesChange={onStatPrioritiesChange} />
        <SubclassSelector 
          characterId={characterId} 
          onSelect={onSubclassSelect}
        />
      </CardContent>
    </Card>
  );
};

export default BuildPrefs;