/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/views/**/*.blade.php', './resources/js/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#071A33', 800: '#0A2244', 700: '#12305A', 500: '#31577F', 300: '#8096B0', 200: '#B2C0D0' },
        paper: { DEFAULT: '#FCFBF8', warm: '#F4F0E7', card: '#FFFFFF' },
        line: { DEFAULT: '#E7E1D5', soft: '#F2EEE6', strong: '#CEC5B4' },
        gold: { DEFAULT: '#B67A22', 400: '#C59040', 100: '#F6E7C7', 50: '#FCF6E8', line: '#E6D2AA' },
        jade: { DEFAULT: '#176A50', 700: '#0E513B', 100: '#EAF6F0', line: '#B8DCCA' },
        clay: { DEFAULT: '#C05A42', 700: '#963D2A', 100: '#FCF0ED' },
        sky: { 100: '#EAF2FB', 700: '#244F7F' },
        muted: '#718097'
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Instrument Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace']
      },
      fontSize: {
        hero: ['clamp(2.75rem, 7vw, 5.75rem)', { lineHeight: '.94', letterSpacing: '-0.045em' }],
        display: ['clamp(2rem, 4vw, 3.75rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        title: ['1.55rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        body: ['0.96rem', { lineHeight: '1.65' }],
        meta: ['0.78rem', { lineHeight: '1.4' }]
      },
      borderRadius: { card: '1.35rem', tile: '1rem', chip: '.55rem' },
      boxShadow: { card: '0 24px 70px -34px rgba(7,26,51,.42)', lift: '0 30px 80px -40px rgba(7,26,51,.55)' },
      keyframes: {
        floatIn: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: '.35' }, '50%': { opacity: '1' } }
      },
      animation: { 'float-in': 'floatIn .55s ease-out both', 'pulse-dot': 'pulseDot 2.6s ease-in-out infinite' }
    }
  },
  plugins: []
};
