
import { LucideIcon, icons } from 'lucide-react';

interface DynamicIconProps {
  icon: string | LucideIcon;
  className?: string;
}

export const DynamicIcon = ({ icon, className }: DynamicIconProps) => {
  if (typeof icon === 'string') {
    const LucideIcon = icons[icon as keyof typeof icons];
    return LucideIcon ? <LucideIcon className={className} /> : null;
  }
  
  const Icon = icon;
  return <Icon className={className} />;
};
