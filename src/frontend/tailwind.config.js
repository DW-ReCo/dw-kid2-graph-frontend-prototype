/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/frontend/pages/**/*.{js,ts,jsx,tsx}",
    "./src/frontend/components/**/*.{js,ts,jsx,tsx}",
    "./src/frontend/containers/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ["bg-white", "bg-red-400", "bg-yellow-400", "bg-green-400"],
  theme: {
    extend: {},
  },
  plugins: [],
};
