/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'yellow-green': {
          '50': '#f7fbea',
          '100': '#ecf5d2',
          '200': '#daebab',
          '300': '#cae28e',
          '400': '#a7cb50',
          '500': '#88b131',
          '600': '#698c24',
          '700': '#516c1f',
          '800': '#42561e',
          '900': '#394a1d',
          '950': '#1c280b',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}