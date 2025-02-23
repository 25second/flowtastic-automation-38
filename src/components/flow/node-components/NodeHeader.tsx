
import { LucideIcon } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';

interface NodeHeaderProps {
  label: string;
  icon?: string | LucideIcon;
  description?: string;
  isPageInteraction: boolean;
  isDataProcessing: boolean;
}

export const NodeHeader = ({ 
  label, 
  icon,
  description,
  isPageInteraction,
  isDataProcessing 
}: NodeHeaderProps) => {
  return (
    <div className="flex flex-col items-start gap-1 w-full">
      <div className="w-full flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {icon && (
          <DynamicIcon 
            icon={icon} 
            className={`h-4 w-4 ${isPageInteraction || isDataProcessing ? 'text-orange-500' : 'text-gray-500'}`}
          />
        )}
      </div>
      {description && (
        <div className="text-xs text-gray-500 line-clamp-2">
          {description}
        </div>
      )}
    </div>
  );
};
