/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: '#7CFF4F',
        neonDark: '#1A5F2A',
        darkBg: '#0B0D10',
        cardBg: '#12151A',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}