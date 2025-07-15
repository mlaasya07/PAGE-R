/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Roboto Mono', 'monospace'],
      },
      colors: {
        'clinical-blue': '#2563eb',
        'clinical-red': '#dc2626',
        'clinical-black': '#1f2937',
      }
    },
  },
  plugins: [],
};