/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // Slate 900
        foreground: "#f8fafc", // Slate 50
        card: "#1e293b", // Slate 800
        "card-foreground": "#e2e8f0", // Slate 200
        primary: "#3b82f6", // Blue 500
        "primary-foreground": "#ffffff",
        secondary: "#10b981", // Emerald 500
        "secondary-foreground": "#ffffff",
        accent: "#6366f1", // Indigo 500
        "accent-foreground": "#ffffff",
        destructive: "#ef4444", // Red 500
        "destructive-foreground": "#ffffff",
        border: "#334155", // Slate 700
        input: "#334155", // Slate 700
        ring: "#3b82f6", // Blue 500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
