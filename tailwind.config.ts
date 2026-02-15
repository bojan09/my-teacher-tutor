import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary: Deep Navy (Trust, Authority)
          navy: "#1E293B",
          // Background: Warm Paper/Cream (Calm, Professional)
          cream: "#F8F5F2",
          // Accent: Muted Gold (Achievement, Premium)
          accent: "#C29730",
          // Secondary: Sky Blue (Friendly, Educational)
          sky: "#E0F2FE",
          // Text: Slate Gray (Readable)
          slate: "#475569",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
