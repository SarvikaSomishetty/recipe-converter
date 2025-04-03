/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ['Lora', 'serif'],
        pacifico: ['Pacifico', 'cursive'],
        nunito: ['Nunito', 'sans-serif']
      },
    },
  },
  plugins: [],
}