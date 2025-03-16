
import { useEffect, useState } from 'react';
import { applyAccentColor } from '@/utils/colorUtils';

export const useAccentColor = () => {
  const [accentColorHex, setAccentColorHex] = useState<string>("#9b87f5");

  useEffect(() => {
    const savedAccentColor = localStorage.getItem("accentColor");
    if (savedAccentColor) {
      setAccentColorHex(savedAccentColor);
      applyAccentColor(savedAccentColor);
    } else {
      // Apply default color if no saved color exists
      applyAccentColor("#9b87f5");
    }
  }, []);

  return { accentColorHex };
};
