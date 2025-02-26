
interface NodeSetting {
  id: string;
  label: string;
}

export const getKeyboardSettings = (type: string): NodeSetting[] => {
  switch (type) {
    case 'keyboard-type':
      return [
        { id: 'text', label: 'Text' },
        { id: 'delay', label: 'Delay' }
      ];
    case 'keyboard-press':
      return [{ id: 'key', label: 'Key' }];
    case 'keyboard-down':
      return [
        { id: 'key', label: 'Key' },
        { id: 'duration', label: 'Duration' }
      ];
    case 'keyboard-shortcut':
      return [{ id: 'shortcut', label: 'Shortcut' }];
    case 'keyboard-focus-type':
      return [
        { id: 'selector', label: 'Selector' },
        { id: 'text', label: 'Text' },
        { id: 'delay', label: 'Delay' }
      ];
    default:
      return [];
  }
};

export const getWaitSettings = (type: string): NodeSetting[] => {
  const settings = [{ id: 'timeout', label: 'Timeout' }];
  if (type === 'wait-element' || type === 'wait-element-hidden') {
    settings.unshift({ id: 'selector', label: 'Selector' });
  }
  return settings;
};

export const getNodeSettings = (type: string | undefined, settings: Record<string, any> | undefined): NodeSetting[] => {
  if (!type || !settings) return [];

  if (type.startsWith('keyboard-')) {
    return getKeyboardSettings(type);
  }

  if (type.startsWith('wait-')) {
    return getWaitSettings(type);
  }

  if (type.startsWith('mouse-')) {
    switch (type) {
      case 'mouse-click':
      case 'mouse-double-click':
      case 'mouse-hover':
        return [{ id: 'selector', label: 'Selector' }];
      case 'mouse-click-modified':
        return [
          { id: 'selector', label: 'Selector' },
          { id: 'modifiers', label: 'Modifiers' }
        ];
      case 'mouse-move':
        return [
          { id: 'x', label: 'X Coordinate' },
          { id: 'y', label: 'Y Coordinate' }
        ];
      case 'mouse-drag-drop':
        return [
          { id: 'startX', label: 'Start X' },
          { id: 'startY', label: 'Start Y' },
          { id: 'endX', label: 'End X' },
          { id: 'endY', label: 'End Y' }
        ];
      case 'mouse-wheel':
        return [
          { id: 'deltaX', label: 'Delta X' },
          { id: 'deltaY', label: 'Delta Y' }
        ];
      default:
        return [];
    }
  }

  // Add tab nodes settings
  switch (type) {
    case 'new-tab':
      return [{ id: 'url', label: 'URL' }];
    case 'switch-tab':
      return [
        { id: 'fromIndex', label: 'From Index' },
        { id: 'toIndex', label: 'To Index' }
      ];
    case 'wait-for-tab':
      return [{ id: 'selector', label: 'Selector' }];
    case 'close-tab':
      return [{ id: 'index', label: 'Tab Index' }];
    case 'reload-page':
      return [{ id: 'waitUntil', label: 'Wait Until' }];
    case 'read-table':
    case 'write-table':
      return [
        { id: 'tableName', label: 'Table Name' },
        { id: 'columnName', label: 'Column' }
      ];
    case 'navigate':
      return [{ id: 'url', label: 'URL' }];
    case 'click':
      return [{ id: 'selector', label: 'Selector' }];
    case 'input-text':
      return [
        { id: 'selector', label: 'Selector' },
        { id: 'text', label: 'Text' }
      ];
    case 'ai-action':
      return [
        { id: 'action', label: 'Action' },
        { id: 'description', label: 'Description' }
      ];
    default:
      return [];
  }
};

export const getNodeOutputs = (
  type: string | undefined,
  outputs: { id: string; label: string }[] | undefined,
  isGeneratePerson: boolean | undefined
) => {
  if (type === 'read-table') return [{ id: 'data', label: 'Data' }];
  if (type === 'ai-action') return [{ id: 'result', label: 'Result' }];
  if (isGeneratePerson) return outputs;
  return undefined;
};
