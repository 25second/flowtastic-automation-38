
export const hexToHSL = (hex: string) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

export const applyAccentColor = (color: string) => {
  const hsl = hexToHSL(color);
  const darkerHsl = {
    ...hsl,
    l: Math.max(0, hsl.l - 10)
  };
  document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  document.documentElement.style.setProperty('--ring', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  document.documentElement.style.setProperty('--primary-darker', `${darkerHsl.h} ${darkerHsl.s}% ${darkerHsl.l}%`);
  document.documentElement.style.setProperty('--sidebar-accent', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  document.documentElement.style.setProperty('--sidebar-accent-foreground', '0 0% 100%');
};
