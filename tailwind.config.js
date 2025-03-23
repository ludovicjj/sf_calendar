/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
    "./assets/**/*.jsx",
  ],
  theme: {
    extend: {
      keyframes: {
        'toast-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'toast-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        'toast-in': 'toast-in-right 0.3s ease-out, fade-in 0.3s ease-out',
        'toast-out': 'toast-out-right 0.3s ease-in forwards, fade-out 0.3s ease-in forwards'
      }
    },
  },
  plugins: [],
}
