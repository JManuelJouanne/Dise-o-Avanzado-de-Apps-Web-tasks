/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './public/**/*.html',
      './src/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            light: '#4f46e5',
            DEFAULT: '#3b82f6',
            dark: '#1e40af'
          },
          accent: '#facc15'
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif']
        }
      }
    },
    plugins: [
      require('@tailwindcss/typography')
    ]
  };
  