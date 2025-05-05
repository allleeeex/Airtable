// Use hash to convert id to colour
export function stringToRGBColour(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const h = Math.abs(hash);

  const r = h & 0xff;
  const g = (h >> 8) & 0xff;
  const b = (h >> 16) & 0xff;

  return `rgb(${r}, ${g}, ${b})`;
}

// Text colour white or black depending on darkness of colour
export function readableTextColour(rgb: string): "#000" | "#fff" {
  const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  const yiq = (r! * 299 + g! * 587 + b! * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff";
}

// Given a colour, make it darker
export function darkenColour(rgb: string, amount: number): string {
  const amt = Math.max(0, Math.min(1, amount));
  const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  const newR = Math.round(r! * (1 - amt));
  const newG = Math.round(g! * (1 - amt));
  const newB = Math.round(b! * (1 - amt));
  return `rgb(${newR}, ${newG}, ${newB})`;
}