export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef5f3",
          100: "#fde8e4",
          200: "#fcd5cd",
          300: "#f9b4a7",
          400: "#f08573",
          500: "#e56b57",
          600: "#d14f3a",
          700: "#af3f2d",
          800: "#913729",
          900: "#783328",
          950: "#411711",
        },
        dark: {
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#ebe5d8",
          300: "#ddd4c1",
          400: "#c4b69e",
          500: "#a89680",
          600: "#8a7a66",
          700: "#6d6052",
          800: "#544a40",
          900: "#3d3630",
          950: "#2a2520",
        },
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        display: ["Clash Display", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
