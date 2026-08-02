/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#e11d48',
          600: '#be123c',
          700: '#9f1239',
          800: '#881337',
          900: '#6b0504',
          crimson: '#8B0000',
          burgundy: '#5B0612',
          gold: '#D4AF37',
          amberGold: '#F59E0B',
          saffron: '#FF9933',
        }
      },
      fontFamily: {
        rozha: ['"Rozha One"', 'serif'],
        tiro: ['"Tiro Devanagari Hindi"', 'serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
