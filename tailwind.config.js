/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Noto Naskh Arabic', 'Amiri', 'Cairo', 'Arial', 'sans-serif'],
      },
      colors: {
        gov: {
          green: '#006633',
          dark: '#004422',
          gold: '#C8A400',
          light: '#f0f7f0',
        }
      }
    },
  },
  plugins: [],
}
