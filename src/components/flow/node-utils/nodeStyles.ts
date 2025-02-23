
import { CSSProperties } from 'react';

export const baseHandleStyle: CSSProperties = {
  width: '8px',
  height: '4px',
  borderRadius: '2px',
  border: 'none',
  backgroundColor: '#9b87f5'
};

export const getNodeBorderStyle = (
  isDataProcessing: boolean,
  isClickNode: boolean,
  isPageInteraction: boolean,
  isStartNode: boolean
): CSSProperties | undefined => {
  if (isDataProcessing || isClickNode) {
    return { borderLeft: '4px solid #F97316' };
  } else if (isPageInteraction) {
    return { borderLeft: '4px solid #F97316' };
  } else if (isStartNode) {
    return { borderLeft: '4px solid #22C55E' };
  }
  return undefined;
};
