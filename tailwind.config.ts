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
        ink: '#061F35',
        ocean: '#0877C9',
        cyan: '#19C2D0',
        mint: '#21C87A',
        sand: '#F5B942',
        cloud: '#F4F8FB',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(6, 31, 53, 0.10)',
      },
    },
  },
  plugins: [],
} satisfies Config;
