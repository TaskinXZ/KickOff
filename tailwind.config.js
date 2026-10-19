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
        pitch: {
          light: '#2d6a4f',
          DEFAULT: '#1b4332',
          dark: '#081c15',
          line: '#74c69d'
        }
      }
    },
  },
  plugins: [],
}
