
import { useState, useEffect } from 'react';
import { baseHandleStyle } from '../../node-utils/nodeStyles';

export const useHandleStyle = () => {
  const [accentColor, setAccentColor] = useState('#9b87f5');

  useEffect(() => {
    const savedAccentColor = localStorage.getItem('accentColor');
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
    }
  }, []);

  return {
    ...baseHandleStyle,
    backgroundColor: accentColor
  };
};
