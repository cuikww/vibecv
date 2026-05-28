// src/app/api/design/fonts/route.ts
// Fetches a curated list of Google Fonts via the Google Fonts API.
// Falls back to a built-in list if the API key is missing.

import { NextResponse } from 'next/server';

export interface FontOption {
  family: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
  label: string;
  cssUrl: string;  // Google Fonts embed URL
  previewText: string;
}

// Curated hand-picked fonts — great for CVs
const CURATED_FONTS: FontOption[] = [
  // Sans-serif
  { family: 'Plus Jakarta Sans', category: 'sans-serif', label: 'Jakarta Sans', cssUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap', previewText: 'Professional & Clean' },
  { family: 'DM Sans',           category: 'sans-serif', label: 'DM Sans',      cssUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap',              previewText: 'Modern & Geometric' },
  { family: 'Outfit',            category: 'sans-serif', label: 'Outfit',       cssUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap',             previewText: 'Friendly & Bold' },
  { family: 'Figtree',           category: 'sans-serif', label: 'Figtree',      cssUrl: 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&display=swap',            previewText: 'Warm & Legible' },
  { family: 'Nunito',            category: 'sans-serif', label: 'Nunito',       cssUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap',             previewText: 'Rounded & Soft' },
  { family: 'Sora',              category: 'sans-serif', label: 'Sora',         cssUrl: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap',               previewText: 'Tech & Minimal' },
  { family: 'Lexend',            category: 'sans-serif', label: 'Lexend',       cssUrl: 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap',                 previewText: 'Readable & Calm' },
  // Serif
  { family: 'Lora',              category: 'serif',      label: 'Lora',         cssUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap',                   previewText: 'Classic & Literary' },
  { family: 'Playfair Display',  category: 'serif',      label: 'Playfair',     cssUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap',       previewText: 'Elegant & Editorial' },
  { family: 'Cormorant Garamond',category: 'serif',      label: 'Cormorant',    cssUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap',     previewText: 'Refined & Luxurious' },
  { family: 'Libre Baskerville', category: 'serif',      label: 'Baskerville',  cssUrl: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap',          previewText: 'Traditional & Solid' },
  { family: 'Crimson Pro',       category: 'serif',      label: 'Crimson Pro',  cssUrl: 'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&display=swap',            previewText: 'Academic & Formal' },
  // Monospace
  { family: 'JetBrains Mono',    category: 'monospace',  label: 'JetBrains',    cssUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap',         previewText: 'Code & Technical' },
  { family: 'Fira Code',         category: 'monospace',  label: 'Fira Code',    cssUrl: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap',                  previewText: 'Hacker & Precise' },
  { family: 'IBM Plex Mono',     category: 'monospace',  label: 'IBM Mono',     cssUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap',              previewText: 'Structured & Geeky' },
  // Display / Unique
  { family: 'Cabinet Grotesk',   category: 'display',    label: 'Cabinet',      cssUrl: 'https://fonts.cdnfonts.com/css/cabinet-grotesk',                                                previewText: 'Bold & Expressive' },
  { family: 'Bebas Neue',        category: 'display',    label: 'Bebas Neue',   cssUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',                              previewText: 'STRONG & IMPACTFUL' },
];

export async function GET() {
  // Try to enrich with Google Fonts API if key exists
  const apiKey = process.env.GOOGLE_FONTS_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity&capability=WOFF2`,
        { next: { revalidate: 86400 } } // cache 24h
      );
      if (res.ok) {
        // We still return our curated list for quality control,
        // but validate that families exist in the Google registry
        const data = await res.json();
        const available = new Set((data.items as any[]).map((f: any) => f.family));
        const verified = CURATED_FONTS.filter(f => 
          f.category === 'monospace' || f.category === 'display' || available.has(f.family)
        );
        return NextResponse.json(verified);
      }
    } catch {
      // fall through to curated list
    }
  }

  return NextResponse.json(CURATED_FONTS);
}