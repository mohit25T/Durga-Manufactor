/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          slate: "#1E293B",
          slateDark: "#0F172A",
          black: "#0F172A",    // Deep Steel Navy
          red: "#0F172A",      // Unified with Deep Steel Navy
          redHover: "#1E293B",
          gray: "#4B5563",
          light: "#FFFFFF",    // Card background (pure white)
          cream: "#E2E8F0",    // Page background (distinct slate-gray shade)
          sage: "#E5E7EB",     // Neutral Light Gray secondary bg
          forest: "#0F172A",   // Primary brand accent color (Deep Steel Navy)
          charcoal: "#0F172A", // Text color
          sand: "#9CA3AF",     // Solid distinct border color (gray-400)
          gold: "#D97706",
          amber: "#D97706"     // Highlight color (Amber-600)
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%23000000' fill-opacity='0.01' fill-rule='evenodd'/%3E%3C/svg%3E\")",
      }
    }
  },
  plugins: []
};
