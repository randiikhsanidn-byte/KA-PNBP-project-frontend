/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#071B33',
          900: '#0B2748',
          800: '#10385F',
          700: '#164A73',
        },
        yellow: {
          500: '#F7C948',
          400: '#FFD768',
        },
        eco: {
          700: '#25654F',
          600: '#2E7D62',
          100: '#E8F3EE',
        },
      },
      boxShadow: {
        soft: '0 14px 40px rgba(7, 27, 51, 0.10)',
      },
    },
  },
  plugins: [],
}
