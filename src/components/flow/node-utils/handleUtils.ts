
export const getSettingsHandlesCount = (settings: Record<string, any> | undefined) => {
  if (!settings) return 0;
  
  let count = 0;

  // Добавляем проверку для нод категории Keyboard
  if (settings.type?.startsWith('keyboard-')) {
    // Type Text node
    if (settings.type === 'keyboard-type') {
      count += 2; // Для text и delay
    }
    // Press Key node
    else if (settings.type === 'keyboard-press') {
      count += 1; // Для key
    }
    // Hold Key node
    else if (settings.type === 'keyboard-down') {
      count += 2; // Для key и duration
    }
    // Keyboard Shortcut node
    else if (settings.type === 'keyboard-shortcut') {
      count += 1; // Для shortcut
    }
    // Focus and Type node
    else if (settings.type === 'keyboard-focus-type') {
      count += 3; // Для selector, text и delay
    }
  } 
  // Остальные проверки для других типов нод
  else {
    if ('selector' in settings) count++;
    if ('text' in settings) count++;
    if ('url' in settings) count++;
    if ('x' in settings || 'startX' in settings) count++;
    if ('y' in settings || 'startY' in settings) count++;
    if ('endX' in settings) count++;
    if ('endY' in settings) count++;
    if ('deltaX' in settings) count++;
    if ('deltaY' in settings) count++;
  }
  
  // Handle math operation inputs
  if (settings.useSettingsPort) {
    if (settings.type?.startsWith('math-') && settings.type !== 'math-random') {
      return 2; // For a and b inputs
    } else if (settings.type === 'math-random') {
      return 1; // For max input only
    } else if (settings.type?.startsWith('mouse-')) {
      return settings.inputs?.length || 0; // For mouse inputs
    }
  }
  
  return count;
};
