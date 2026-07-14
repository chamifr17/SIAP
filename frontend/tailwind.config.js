/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f0f3ea',
          100: '#dfe6d2',
          200: '#c1cea9',
          500: '#60713f',
          700: '#3f4d2d',
          800: '#2f3b22',
          900: '#1f2818'
        },
        field: '#f7f9f2'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(31,40,24,0.14)'
      }
    }
  },
  plugins: []
};
