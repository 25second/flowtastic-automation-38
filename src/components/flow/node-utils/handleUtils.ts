
export const getSettingsHandlesCount = (settings: Record<string, any> | undefined) => {
  if (!settings) return 0;
  
  let count = 0;
  if ('selector' in settings) count++;
  if ('text' in settings) count++;
  if ('url' in settings) count++;
  if ('x' in settings || 'startX' in settings) count++;
  if ('y' in settings || 'startY' in settings) count++;
  if ('endX' in settings) count++;
  if ('endY' in settings) count++;
  if ('deltaX' in settings) count++;
  if ('deltaY' in settings) count++;
  
  return count;
};
