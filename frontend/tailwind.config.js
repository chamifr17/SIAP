/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f3f5f0',
          100: '#e3e8dc',
          200: '#cbd5bd',
          500: '#70804d',
          700: '#4a5b35',
          900: '#24311f'
        },
        field: '#f8faf6'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(36,49,31,0.10)'
      }
    }
  },
  plugins: []
};
