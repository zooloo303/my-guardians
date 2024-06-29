import { Card, CardContent } from "@/components/ui/card";
import StatPrioritySelector from './StatPrioritySelector';
import SubclassSelector from './SubclassSelector';

interface CharacterCustomizationProps {
  characterId: string;
}

const BuildPrefs: React.FC<CharacterCustomizationProps> = ({ characterId }) => {
  return (
    <Card className="max-w-lg p-4">
      <CardContent className="space-y-6">
        <StatPrioritySelector />
        <SubclassSelector characterId={characterId} />
      </CardContent>
    </Card>
  );
};

export default BuildPrefs;