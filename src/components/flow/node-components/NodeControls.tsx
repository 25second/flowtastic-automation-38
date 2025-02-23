
import { Settings2, Trash2 } from 'lucide-react';

interface NodeControlsProps {
  selected: boolean;
  onSettingsClick?: ((event: React.MouseEvent) => void) | undefined;
  onDelete: (event: React.MouseEvent) => void;
}

export const NodeControls = ({ selected, onSettingsClick, onDelete }: NodeControlsProps) => {
  return (
    <div className={`
      absolute -right-2 -top-2 flex gap-2 z-50
      ${selected ? 'visible' : 'invisible group-hover:visible'}
    `}>
      {onSettingsClick && (
        <button 
          onClick={onSettingsClick} 
          title="Node settings" 
          className="p-1 bg-white shadow-sm hover:bg-gray-100 border nodrag rounded-full py-[4px] px-[4px]"
        >
          <Settings2 className="h-3 w-3 text-gray-600" />
        </button>
      )}
      <button 
        onClick={onDelete} 
        title="Delete node" 
        className="p-1 rounded-full bg-white shadow-sm hover:bg-red-100 border nodrag py-[4px] px-[4px]"
      >
        <Trash2 className="h-3 w-3 text-gray-600 hover:text-red-600" />
      </button>
    </div>
  );
};
