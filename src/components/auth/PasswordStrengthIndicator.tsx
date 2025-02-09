
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthIndicatorProps {
  strength: number;
}

export const PasswordStrengthIndicator = ({ strength }: PasswordStrengthIndicatorProps) => {
  const getPasswordStrengthColor = () => {
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-orange-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-2">
      <Progress 
        value={strength} 
        className={`h-2 ${getPasswordStrengthColor()}`}
      />
      <p className="text-sm text-gray-500">
        Password must contain at least 8 characters, including uppercase, numbers, and special characters
      </p>
    </div>
  );
};
