/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Corrected for JavaScript
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Futuristic Dark Base
        'midnight': {
          DEFAULT: '#0A0A0E', // Very dark background
          '900': '#121217',
          '800': '#1A1A22',
          '700': '#2C2C38',
        },
        // Primary Accent (subtle but present)
        'steel': {
          DEFAULT: '#4A5C6C', // Muted blue-gray
          'light': '#6B7A8B',
          'dark': '#384752',
        },
        // Vibrant Accent (for buttons, highlights, active states)
        'electric': {
          DEFAULT: '#00F0FF', // Bright cyan/electric blue
          'light': '#66F3FF',
          'dark': '#00B8CC',
        },
        // Secondary, slightly warmer accent for balance
        'violet-glow': {
          DEFAULT: '#8A2BE2', // Medium purple
          'light': '#BD8EE8',
          'dark': '#6A1EA8',
        },
        // Text/Foreground colors
        'text-light': '#E0E0E0', // Light gray for general text
        'text-dark': '#A0A0A0',  // Darker gray for subtle text
      },
      // You can also extend other theme properties here if needed, e.g., fonts, spacing
      fontFamily: {
        sans: ['"Space Mono"', 'monospace'], // Example: use a futuristic monospaced font
        // Or if you prefer a more modern sans-serif
        // sans: ['"Inter"', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}