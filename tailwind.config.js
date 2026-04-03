/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Noto Sans JP',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'monospace',
        ],
      },
      colors: {
        lens: {
          context: '#1e293b',   // slate-800
          user:    '#14532d',   // green-900
          actor:   '#1e3a5f',   // blue lens
          director:'#3b1f5e',   // purple lens
          producer:'#5e2d1a',   // amber lens
          historian:'#1a4a3a',  // teal lens
        },
      },
    },
  },
  plugins: [],
}
