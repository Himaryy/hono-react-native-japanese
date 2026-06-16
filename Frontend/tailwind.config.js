/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#D96E28',
          dark: '#E57B38',
          DEFAULT: '#D96E28',
        },
        accent: {
          light: '#6640C4',
          dark: '#8B68E8',
          DEFAULT: '#6640C4',
        },
        bg: {
          light: '#FFFFFF',
          dark: '#1A1A1A',
        },
        surface: {
          light: '#F8F6F5',
          dark: '#262120',
        },
        ink: {
          light: '#221D17',
          dark: '#F5F2EF',
        },
        muted: '#87817B',
      },
    },
  },
  plugins: [],
};
