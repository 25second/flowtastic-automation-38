
import { Background, Controls, MiniMap } from '@xyflow/react';

export const FlowControls = () => {
  return (
    <>
      <Background gap={15} size={1} />
      <Controls />
      <MiniMap 
        nodeColor={() => '#fff'}
        maskColor="rgb(0, 0, 0, 0.1)"
      />
    </>
  );
};
