// src/app/api/design/colors/route.ts
// Returns a curated list of color palettes.
// Each palette has 5 shades generated so templates can use them as CSS vars.
// This is intentionally static — no external call needed, instant response.

import { NextResponse } from 'next/server';

export interface ColorPalette {
  key: string;
  label: string;
  emoji: string;
  hex: string;        // swatch color shown in picker
  shades: {
    primary: string;  // main accent (headers, titles)
    dark:    string;  // darker variant (borders, hover)
    light:   string;  // very light tint (sidebar bg when subtle)
    bg:      string;  // sidebar / block background
    text:    string;  // text on top of `bg`
  };
}

const PALETTES: ColorPalette[] = [
  {
    key: 'indigo', label: 'Indigo', emoji: '💜', hex: '#4f46e5',
    shades: { primary: '#4f46e5', dark: '#3730a3', light: '#e0e7ff', bg: '#4f46e5', text: '#ffffff' },
  },
  {
    key: 'blue', label: 'Ocean Blue', emoji: '🌊', hex: '#1d4ed8',
    shades: { primary: '#1d4ed8', dark: '#1e3a8a', light: '#dbeafe', bg: '#1d4ed8', text: '#ffffff' },
  },
  {
    key: 'sky', label: 'Sky', emoji: '☁️', hex: '#0284c7',
    shades: { primary: '#0284c7', dark: '#075985', light: '#e0f2fe', bg: '#0284c7', text: '#ffffff' },
  },
  {
    key: 'emerald', label: 'Emerald', emoji: '🌿', hex: '#059669',
    shades: { primary: '#059669', dark: '#065f46', light: '#d1fae5', bg: '#059669', text: '#ffffff' },
  },
  {
    key: 'teal', label: 'Teal', emoji: '🦚', hex: '#0d9488',
    shades: { primary: '#0d9488', dark: '#134e4a', light: '#ccfbf1', bg: '#0d9488', text: '#ffffff' },
  },
  {
    key: 'cyan', label: 'Cyan', emoji: '🧊', hex: '#0891b2',
    shades: { primary: '#0891b2', dark: '#164e63', light: '#cffafe', bg: '#0891b2', text: '#ffffff' },
  },
  {
    key: 'violet', label: 'Violet', emoji: '🔮', hex: '#7c3aed',
    shades: { primary: '#7c3aed', dark: '#4c1d95', light: '#ede9fe', bg: '#7c3aed', text: '#ffffff' },
  },
  {
    key: 'purple', label: 'Purple', emoji: '🍇', hex: '#9333ea',
    shades: { primary: '#9333ea', dark: '#581c87', light: '#f3e8ff', bg: '#9333ea', text: '#ffffff' },
  },
  {
    key: 'fuchsia', label: 'Fuchsia', emoji: '🌸', hex: '#c026d3',
    shades: { primary: '#c026d3', dark: '#701a75', light: '#fae8ff', bg: '#c026d3', text: '#ffffff' },
  },
  {
    key: 'rose', label: 'Rose', emoji: '🌹', hex: '#e11d48',
    shades: { primary: '#e11d48', dark: '#881337', light: '#ffe4e6', bg: '#e11d48', text: '#ffffff' },
  },
  {
    key: 'orange', label: 'Orange', emoji: '🍊', hex: '#ea580c',
    shades: { primary: '#ea580c', dark: '#7c2d12', light: '#ffedd5', bg: '#ea580c', text: '#ffffff' },
  },
  {
    key: 'amber', label: 'Amber', emoji: '🔥', hex: '#d97706',
    shades: { primary: '#d97706', dark: '#78350f', light: '#fef3c7', bg: '#d97706', text: '#1c1917' },
  },
  {
    key: 'lime', label: 'Lime', emoji: '🍋', hex: '#65a30d',
    shades: { primary: '#65a30d', dark: '#365314', light: '#ecfccb', bg: '#65a30d', text: '#1a2e05' },
  },
  {
    key: 'slate', label: 'Slate', emoji: '🪨', hex: '#475569',
    shades: { primary: '#475569', dark: '#1e293b', light: '#f1f5f9', bg: '#334155', text: '#ffffff' },
  },
  {
    key: 'zinc', label: 'Zinc', emoji: '🖤', hex: '#27272a',
    shades: { primary: '#27272a', dark: '#09090b', light: '#f4f4f5', bg: '#18181b', text: '#ffffff' },
  },
  {
    key: 'brown', label: 'Mahogany', emoji: '🪵', hex: '#92400e',
    shades: { primary: '#92400e', dark: '#451a03', light: '#fef3c7', bg: '#78350f', text: '#ffffff' },
  },
];

export async function GET() {
  return NextResponse.json(PALETTES);
}