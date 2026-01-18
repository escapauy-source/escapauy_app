/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold-boutique': {
          DEFAULT: '#C5A05A',
          50: '#F9F5ED',
          100: '#F3ECD9',
          200: '#E8D9B3',
          300: '#DCC68D',
          400: '#D1B367',
          500: '#C5A05A',
          600: '#B08A41',
          700: '#8A6B33',
          800: '#644D25',
          900: '#3E2E17',
        },
        'primary': {
          DEFAULT: '#0EA5E9',
          50: '#E0F2FE',
          100: '#BAE6FD',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
          800: '#0C4A6E',
          900: '#082F49',
        },
        'secondary': {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '1.5rem': '1.5rem',
        '2rem': '2rem',
        '2.5rem': '2.5rem',
        '3rem': '3rem',
        '3.5rem': '3.5rem',
      },
      letterSpacing: {
        'widest': '0.3em',
        '0.2em': '0.2em',
        '0.3em': '0.3em',
        '0.4em': '0.4em',
      },
      fontSize: {
        '10px': '10px',
        '5xl': ['3rem', { lineHeight: '1.1' }],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      blur: {
        '30px': '30px',
      },
    },
  },
  plugins: [],
}
