
import { Background, Controls, MiniMap } from '@xyflow/react';

export const FlowControls = () => {
  return (
    <>
      <Background gap={15} size={1} color="#e5e5e5" />
      <Controls 
        showInteractive={true}
        className="bg-background border shadow-sm"
      />
      <MiniMap 
        nodeColor={(node) => {
          switch (node.type) {
            case 'ai-action':
              return '#FF6B6B';
            case 'generate-person':
              return '#6366F1';
            default:
              return '#eee';
          }
        }}
        nodeStrokeWidth={3}
        zoomable
        pannable
        className="bg-background border shadow-sm"
      />
    </>
  );
};
