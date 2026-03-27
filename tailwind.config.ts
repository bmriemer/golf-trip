import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040c1a',
          900: '#0a1628',
          800: '#0e2040',
          700: '#152d58',
          600: '#1b3a70',
          500: '#224888',
        },
        gold: {
          200: '#f5edd6',
          300: '#e5cc8e',
          400: '#c9a84c',
          500: '#b8923a',
          600: '#9a7728',
          700: '#7a5c18',
        },
        carolina: {
          300: '#7ec4e8',
          400: '#6bb3e0',
          500: '#4B9CD3',
          600: '#3a85b8',
          700: '#2d6a96',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
