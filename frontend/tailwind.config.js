/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkest: '#070a12',
        darker: '#0c101d',
        surface: '#12182b',
        card: '#161e36',
        cardHover: '#1c2744',
        borderSubtle: '#1e2947',
        cyanPrimary: '#00e5ff',
        tealAccent: '#00d2b4',
        purpleAccent: '#8b5cf6',
        greenSuccess: '#00e676',
        amberWarning: '#ffb300',
        redDanger: '#ff1744'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
