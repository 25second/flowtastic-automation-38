
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { availableOutputs } from "../constants";

interface OutputSelectorsProps {
  selectedOutputs: string[];
  onOutputToggle: (outputId: string) => void;
}

export const OutputSelectors = ({ selectedOutputs, onOutputToggle }: OutputSelectorsProps) => {
  return (
    <div className="space-y-4">
      <div className="font-medium text-sm">Generated Data Points</div>
      <div className="grid grid-cols-2 gap-4">
        {availableOutputs.map((output) => (
          <div key={output.id} className="flex items-center space-x-2">
            <Checkbox
              id={output.id}
              checked={selectedOutputs.includes(output.id)}
              onCheckedChange={() => onOutputToggle(output.id)}
            />
            <Label htmlFor={output.id}>{output.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};
