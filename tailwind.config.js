/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Brand palette extracted from the Scrollin' brand image ──────────

        // Page background — warm yellow-cream (the canvas of the image)
        cream: {
          50:  '#FEFEFC',
          100: '#F7F4E0',   // ← exact background of the image
          200: '#F0EDD0',
          300: '#E5E1C0',
          400: '#D8D3AA',
          500: '#C8C295',
        },

        // Powder blue — large circles, card fills, primary accent
        // The big circle in the image and the dot circles
        powder: {
          50:  '#F3F7FB',
          100: '#E4EEF6',
          200: '#CCDDE8',   // ← exact circle color in the image
          300: '#B2CCDE',
          400: '#96B9D0',
          500: '#7CA6C0',
          600: '#6192AE',   // ← "Judge Introductions" button fill
          700: '#4E7D97',
          800: '#3C6278',
          900: '#2C4A5A',
        },

        // Chocolate brown — headings, strong text, "Part 2" badge
        // "Meet More Judges!" and "Part 2" background
        choco: {
          50:  '#F5EEEC',
          100: '#E8D5CF',
          200: '#D0AA9F',
          300: '#B57E6F',
          400: '#945646',
          500: '#6B3325',
          600: '#5C2B1E',   // ← "Part 2" badge dark brown
          700: '#4A2218',
          800: '#3D1A12',   // ← deepest heading color
          900: '#2E120C',
        },

        // Steel blue — body text, dates, medium labels
        // "Deadline: June 3rd" and "Case Study Competition"
        steel: {
          50:  '#EFF4F8',
          100: '#D9E6EF',
          200: '#B4CCDF',
          300: '#8AAFC9',   // ← "Scrollin'" display text color
          400: '#6B95B8',
          500: '#5580A2',   // ← "Case Study Competition" text
          600: '#456A8A',
          700: '#365471',
          800: '#284059',
          900: '#1C2E42',
        },

        // Sage green — success / healthy states (kept from before)
        sage: {
          50:  '#F1F5F0',
          100: '#E0EBE0',
          200: '#C1D6C0',
          300: '#9CBD9C',
          400: '#75A275',
          500: '#548854',
          600: '#3F6E3F',
          700: '#315731',
          800: '#264326',
          900: '#1C311C',
        },
      },

      fontFamily: {
        sans:  ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'Cambria', 'serif'],
      },

      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },

      boxShadow: {
        'soft':   '0 2px 8px rgba(92,43,30,0.06), 0 6px 24px rgba(92,43,30,0.04)',
        'card':   '0 1px 4px rgba(92,43,30,0.05), 0 4px 16px rgba(92,43,30,0.04)',
        'lifted': '0 4px 14px rgba(92,43,30,0.10), 0 12px 36px rgba(92,43,30,0.08)',
        'powder': '0 4px 20px rgba(124,166,192,0.30)',
      },

      animation: {
        'fade-in':    'fadeIn 0.6s ease forwards',
        'fade-up':    'fadeUp 0.7s ease forwards',
        'slide-in':   'slideIn 0.4s ease forwards',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'sway':       'sway 8s ease-in-out infinite',
      },

      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                                '100%': { opacity: '1' } },
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-10px)' },'100%': { opacity: '1', transform: 'translateX(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        sway:    { '0%,100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
      },

      backgroundImage: {
        'dot-powder': "radial-gradient(circle, #CCDDE8 1.5px, transparent 1.5px)",
        'lined-paper':"repeating-linear-gradient(transparent, transparent 27px, #E4EEF6 27px, #E4EEF6 28px)",
      },
    },
  },
  plugins: [],
};
