/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },

      colors: {
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        surface: {
          0: "rgb(var(--surface-0) / <alpha-value>)",
          1: "rgb(var(--surface-1) / <alpha-value>)",
          2: "rgb(var(--surface-2) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
        },
        border: {
          subtle: "rgb(var(--border-subtle) / <alpha-value>)",
        },
        aqi: {
          good: "rgb(var(--aqi-good) / <alpha-value>)",
          moderate: "rgb(var(--aqi-moderate) / <alpha-value>)",
          usg: "rgb(var(--aqi-usg) / <alpha-value>)",
          unhealthy: "rgb(var(--aqi-unhealthy) / <alpha-value>)",
          "very-unhealthy": "rgb(var(--aqi-very-unhealthy) / <alpha-value>)",
          hazardous: "rgb(var(--aqi-hazardous) / <alpha-value>)",
        },
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },

      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },

      backdropBlur: {
        glass: "var(--glass-blur)",
      },
    },
  },
  plugins: [],
};