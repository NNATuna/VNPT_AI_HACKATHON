import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        neon: {
          cyan: "#2AFADF",
          purple: "#7C3AED"
        }
      },
      boxShadow: {
        glow: "0 0 20px rgba(124,58,237,0.5)",
      }
    },
  },
  plugins: [],
};
export default config;
