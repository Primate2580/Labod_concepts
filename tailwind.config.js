/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0F",
        navy: "#1F2A8A",
        amber: "#FFA800",
        "brand-yellow": "#FFD400",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
