import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        primary: '#E9E1D3',
        'primary-dark': '#DDD4C6',
        'brown-dark': '#2C1A14',
        'brown-medium': '#7D5A4A',
        'brown-light': '#C5B5A8',
        booked: '#C27B6E',
        'booked-light': '#F5E8E6',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
