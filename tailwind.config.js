/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'light-bg': {
          start: '#f8fafc',
          mid: '#e0e7ff',
          end: '#f1f5f9',
        },
        'dark-bg': {
          start: '#0f172a',
          mid: '#1e1b4b',
          end: '#1e293b',
        },
      },
    },
  },
  plugins: [],
}

