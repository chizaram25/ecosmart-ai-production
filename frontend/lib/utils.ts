import { WasteCategory } from "../types";

export const WASTE_EMOJI: Record<WasteCategory, string> = {
  plastic: '🧴',
  paper:   '📰',
  metal:   '🥫',
  ewaste:  '📱',
  organic: '🌱',
  glass:   '🍾',
  rubber:  '🔴',
  unknown: '🗑️',
};

export function formatNaira(min: number, max: number): string {
  return `₦${min.toLocaleString()}–${max.toLocaleString()}`;
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
