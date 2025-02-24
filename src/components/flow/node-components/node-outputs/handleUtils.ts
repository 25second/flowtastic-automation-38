
export const getSettingHandles = (settings?: Record<string, any>) => {
  if (!settings) return { inputs: [], outputs: [] };
  
  if (settings.useSettingsPort && settings.inputs && settings.outputs) {
    return {
      inputs: settings.inputs,
      outputs: settings.outputs
    };
  }
  
  const handledSettings = [];
  
  if ('selector' in settings) {
    handledSettings.push({ id: 'selector', label: 'Selector' });
  }
  if ('text' in settings) {
    handledSettings.push({ id: 'text', label: 'Text' });
  }
  if ('url' in settings) {
    handledSettings.push({ id: 'url', label: 'URL' });
  }
  if ('x' in settings || 'startX' in settings) {
    handledSettings.push({ id: 'x', label: 'X' });
  }
  if ('y' in settings || 'startY' in settings) {
    handledSettings.push({ id: 'y', label: 'Y' });
  }
  if ('endX' in settings) {
    handledSettings.push({ id: 'endX', label: 'End X' });
  }
  if ('endY' in settings) {
    handledSettings.push({ id: 'endY', label: 'End Y' });
  }
  if ('deltaX' in settings) {
    handledSettings.push({ id: 'deltaX', label: 'Delta X' });
  }
  if ('deltaY' in settings) {
    handledSettings.push({ id: 'deltaY', label: 'Delta Y' });
  }
  
  return { inputs: handledSettings, outputs: [] };
};

export const validateConnection = (connection: any) => {
  if (connection.targetHandle?.startsWith('input-')) {
    return true;
  }
  return true;
};
