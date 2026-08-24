import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0F0F0F",
        accentOrange: "#FF6B35",
        accentLime: "#C6FF00",
        neutralBorder: "#262626",
        cardBg: "#161616",
      },
      fontFamily: {
        display: ["var(--font-outfit)", "Outfit", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
