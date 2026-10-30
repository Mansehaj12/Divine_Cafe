/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede6',
          200: '#c5dcd0',
          300: '#9dc2b0',
          400: '#6fa38b',
          500: '#4c866f',
          600: '#386c57',
          700: '#2d5646',
          800: '#234438',
          900: '#1a372d',
          950: '#0e201a',
        },
        cream: {
          50: '#fdfcf9',
          100: '#faf7f2',
          200: '#f4efe5',
          300: '#ece3d2',
          400: '#ded0b7',
          500: '#cdb998',
          600: '#bca17c',
          700: '#9c8160',
          800: '#7e674f',
          900: '#675442',
        },
        olive: {
          50: '#f6f7f2',
          100: '#eaede0',
          200: '#d5dcc3',
          300: '#b8c59f',
          400: '#9ba97c',
          500: '#7f8f60',
          600: '#637149',
          700: '#4d5739',
          800: '#404730',
          900: '#373d2b',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0,0,0,0.06)',
        'elevated': '0 20px 40px -15px rgba(20,56,38,0.12)',
      }
    },
  },
  plugins: [],
}
