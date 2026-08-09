import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tokens historiques conservés pour éviter toute régression V1.
        ink: {
          DEFAULT: '#061F35',
          700: '#122744',
          600: '#1B3352',
          500: '#2E4A6E',
          300: '#7E8FAC',
          200: '#A9B6CC',
        },
        ocean: '#0877C9',
        cyan: '#19C2D0',
        mint: '#21C87A',
        sand: '#F5B942',
        cloud: '#F4F8FB',
        dgNavy: '#0B1F33',
        dgGold: '#C89B3C',
        dgGreen: '#2E6B4A',
        dgIvory: '#F7F5EF',

        // Design system Claude — ajouté sans remplacer les palettes Tailwind standard.
        slate: {
          ink: '#4C5A72',
          muted: '#8A97AC',
          line2: '#3A4761',
        },
        paper: {
          DEFAULT: '#FBFAF7',
          warm: '#F2EFE7',
          card: '#FFFFFF',
        },
        line: {
          DEFAULT: '#E7E3D9',
          soft: '#F0EDE4',
          strong: '#D8D2C4',
        },
        gold: {
          DEFAULT: '#A9762B',
          400: '#B8863B',
          100: '#F5E7CB',
          50: '#FBF6EA',
          line: '#E2D8C2',
        },
        jade: {
          DEFAULT: '#1E6B52',
          700: '#12563F',
          100: '#EDF7F2',
          line: '#BEDCCE',
        },
        clay: {
          DEFAULT: '#C0563F',
          700: '#9A4630',
          100: '#FCF1EE',
          line: '#DFB6A9',
        },
        dgSky: {
          100: '#EAF2FA',
          700: '#25507F',
        },
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        label: ['0.66rem', { lineHeight: '1', letterSpacing: '0.1em' }],
        meta: ['0.78rem', { lineHeight: '1.4' }],
        body: ['0.9rem', { lineHeight: '1.55' }],
        lead: ['1.03rem', { lineHeight: '1.6' }],
      },
      borderRadius: {
        card: '1.125rem',
        tile: '0.875rem',
        chip: '0.375rem',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(6, 31, 53, 0.10)',
        card: '0 24px 48px -18px rgba(10,27,51,.35)',
      },
      keyframes: {
        pulseDot: { '0%,100%': { opacity: '.35' }, '50%': { opacity: '1' } },
        drawEdge: { from: { strokeDashoffset: '260' }, to: { strokeDashoffset: '0' } },
      },
      animation: {
        'pulse-dot': 'pulseDot 2.6s ease-in-out infinite',
        'draw-edge': 'drawEdge 1.6s ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config;
