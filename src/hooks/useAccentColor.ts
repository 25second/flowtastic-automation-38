
import { useEffect } from 'react';
import { applyAccentColor } from '@/utils/colorUtils';

export const useAccentColor = () => {
  useEffect(() => {
    const savedAccentColor = localStorage.getItem("accentColor");
    if (savedAccentColor) {
      applyAccentColor(savedAccentColor);
    } else {
      // Применяем цвет по умолчанию, если сохраненного нет
      applyAccentColor("#9b87f5");
    }
  }, []);
};
