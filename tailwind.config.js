/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#F5F7FF',
          100: '#EBF0FE',
          200: '#CEDCFD',
          300: '#A3BFFB',
          400: '#709BF8',
          500: '#3B82F6', // Apple-style primary blue
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#172554',
        },
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        glow: '0 0 25px -5px rgba(59, 130, 246, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.96)' },
          '50%': { opacity: '0.7', transform: 'scale(1.04)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float: 'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
