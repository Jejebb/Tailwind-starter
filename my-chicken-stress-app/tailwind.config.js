/** @type {import('tailwindcss').Config} */
module.exports = {
  // This 'content' array is CRUCIAL. It tells Tailwind where to find your utility classes.
  // Make sure the paths here match your actual project structure.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all JS, JSX, TS, TSX files in the src directory
    "./public/index.html",         // Scans your main HTML file
  ],
  theme: {
    extend: {
      // Define your custom keyframes for animations here
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      // Map your keyframes to animation utility classes
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      // Define custom transition properties for smooth transitions (not keyframe animations)
      transitionProperty: {
        'bg-color': 'background-color',
        'shadow': 'box-shadow',
        'transform': 'transform',
      },
    },
  },
  plugins: [],
}