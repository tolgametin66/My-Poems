import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const POET_COLORS = [
  '#7F77DD', '#E07A5F', '#3D9970', '#118AB2',
  '#EF476F', '#F2CC8F', '#06D6A0', '#9B8DD4',
];

export function getPoetColor(index) {
  return POET_COLORS[index % POET_COLORS.length];
}

export function formatYear(born, died) {
  if (!born && !died) return null;
  if (born && died) return `${born}–${died}`;
  if (born) return `b. ${born}`;
  return `d. ${died}`;
}
