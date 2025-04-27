export function stringToHslColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 60; // percent
  const lightness = 50;  // percent

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}