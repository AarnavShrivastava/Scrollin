/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core palette — warm neutrals, not cold dark
        sand: {
          50:  '#faf8f5',
          100: '#f4f0ea',
          200: '#e8e0d4',
          300: '#d4c9b8',
          400: '#b8a898',
          500: '#9a8878',
          600: '#7d6b5a',
          700: '#625241',
          800: '#4a3c30',
          900: '#332a20',
        },
        // Calm accent — dusty blue (matches Scrollin' Instagram palette)
        calm: {
          50:  '#eff5fb',
          100: '#dbeaf7',
          200: '#b6d4f0',
          300: '#83b5e6',
          400: '#5497d8',
          500: '#367cc8',
          600: '#2962ad',
          700: '#22508e',
          800: '#1d4275',
          900: '#183762',
        },
        // Bark — deep warm brown for dark sections (matches Instagram dark backgrounds)
        bark: {
          50:  '#faf5f0',
          100: '#f3e9dc',
          200: '#e5cfb5',
          300: '#d2ae83',
          400: '#ba8647',
          500: '#a06523',
          600: '#844d16',
          700: '#673a0e',
          800: '#4a2909',
          900: '#2e1806',
        },
        // Sage — for positive / healthy states
        sage: {
          50:  '#f2f7f2',
          100: '#e2efe3',
          200: '#c4dfc6',
          300: '#9dc8a0',
          400: '#72ab77',
          500: '#508f56',
          600: '#3d7343',
          700: '#325c37',
          800: '#2a4a2e',
          900: '#233d26',
        },
        // Rose — for reflection / emotion — soft, not alarming
        blush: {
          50:  '#fff4f4',
          100: '#ffe8e8',
          200: '#ffd0d0',
          300: '#ffadad',
          400: '#ff8080',
          500: '#f95858',
          600: '#e63535',
          700: '#c22626',
          800: '#a12323',
          900: '#852323',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.6s ease forwards',
        'fade-up':   'fadeUp 0.6s ease forwards',
        'slide-in':  'slideIn 0.4s ease forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                                '100%': { opacity: '1' } },
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-8px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
