// src/components/cv/theme.ts
// Central theme contract shared by all CV templates.

export interface ThemeConfig {
  colorKey:   string;   // key from ColorPalette
  fontFamily: string;   // Google Fonts family name e.g. "Plus Jakarta Sans"
  layout:     string;   // template key
}

export interface ColorShades {
  primary: string;
  dark:    string;
  light:   string;
  bg:      string;
  text:    string;      // text on top of bg
}

/** Convert ThemeConfig + resolved shades → inline CSS vars string */
export function buildCssVars(shades: ColorShades, fontFamily: string): React.CSSProperties {
  return {
    '--cv-primary':  shades.primary,
    '--cv-dark':     shades.dark,
    '--cv-light':    shades.light,
    '--cv-bg':       shades.bg,
    '--cv-on-bg':    shades.text,
    fontFamily:      `'${fontFamily}', system-ui, sans-serif`,
  } as React.CSSProperties;
}   