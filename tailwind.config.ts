import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F9F9F9", // White Smoke
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#DCEEFF", // Baby Blue
          foreground: "#1a1a1a", // Dark text for contrast
          50: "#F0F8FF",
          100: "#DCEEFF",
          200: "#C1E4FF",
          300: "#96D5FF",
          400: "#5BBDFF",
          500: "#2FA0FF",
          600: "#1A7FE8",
          700: "#1565C0",
          800: "#0D47A1",
          900: "#0A3D91",
        },
        secondary: {
          DEFAULT: "#F9F9F9", // White Smoke
          foreground: "#1a1a1a",
          50: "#FFFFFF",
          100: "#F9F9F9",
          200: "#F5F5F5",
          300: "#EEEEEE",
          400: "#E0E0E0",
          500: "#BDBDBD",
          600: "#9E9E9E",
          700: "#757575",
          800: "#424242",
          900: "#212121",
        },
        accent: {
          DEFAULT: "#EDE7F6", // Pale Lavender
          foreground: "#1a1a1a",
          50: "#F8F5FF",
          100: "#EDE7F6",
          200: "#D1C4E9",
          300: "#B39DDB",
          400: "#9575CD",
          500: "#7E57C2",
          600: "#673AB7",
          700: "#512DA8",
          800: "#4527A0",
          900: "#311B92",
        },
        success: {
          DEFAULT: "#DFFFE0", // Pale Green
          foreground: "#1a1a1a",
          50: "#F1FFF1",
          100: "#DFFFE0",
          200: "#BBFFBC",
          300: "#86FF88",
          400: "#4AFF4D",
          500: "#1FFF22",
          600: "#00E603",
          700: "#00B302",
          800: "#008C02",
          900: "#006B01",
        },
        error: {
          DEFAULT: "#FFE5E5", // Pale Pink
          foreground: "#1a1a1a",
          50: "#FFF5F5",
          100: "#FFE5E5",
          200: "#FFCCCC",
          300: "#FF9999",
          400: "#FF6666",
          500: "#FF3333",
          600: "#FF0000",
          700: "#CC0000",
          800: "#990000",
          900: "#660000",
        },
        destructive: {
          DEFAULT: "#FFE5E5", // Pale Pink
          foreground: "#990000",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#6B7280",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1a1a1a",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1a1a1a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
