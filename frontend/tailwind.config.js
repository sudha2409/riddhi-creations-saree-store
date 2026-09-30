/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F8F5F0',
          50: '#FFFFFF',
          100: '#F8F5F0',
          200: '#F0EBE1',
        },
        charcoal: {
          DEFAULT: '#171717',
          800: '#262626',
          900: '#171717',
          950: '#0F0F0F',
        },
        obsidian: {
          DEFAULT: '#171717',
          800: '#262626',
          900: '#171717',
          950: '#0F0F0F',
        },
        wine: {
          DEFAULT: '#7A1F2B',
          600: '#7A1F2B',
          700: '#631822',
          800: '#4D121A',
        },
        gold: {
          DEFAULT: '#B5924E',
          400: '#C5A059',
          500: '#B5924E',
          600: '#9B7B3E',
        },
        warmgray: '#6E6963',
        subtle: '#E5E0D8',
        muted: '#6E6963',
        footerbg: '#171515',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
