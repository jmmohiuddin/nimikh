import type { Config } from 'tailwindcss';

/**
 * Tailwind is wired to consume the same CSS custom properties defined in
 * app/globals.css (:root), so utility classes and existing class-based
 * components stay visually identical. Do not hardcode hex values here —
 * add them to :root in globals.css and reference the var here.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: {
          base: 'var(--surface-base)',
          overlay: 'var(--surface-overlay)',
        },
        fg: {
          primary: 'var(--fg-primary)',
          secondary: 'var(--fg-secondary)',
          tertiary: 'var(--fg-tertiary)',
        },
        border: {
          hairline: 'var(--border-hairline)',
          subtle: 'var(--border-subtle)',
        },
        interactive: {
          action: 'var(--interactive-action)',
          hover: 'var(--interactive-hover)',
        },
        status: {
          error: 'var(--status-error)',
        },
        indigo500: 'var(--indigo-500)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
      },
    },
  },
  plugins: [],
};

export default config;
