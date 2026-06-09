import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1628',
          800: '#0F1C2E',
          700: '#162338',
          600: '#1E2F47',
          500: '#2A3F5C',
        },
        teal: {
          500: '#00D4A8',
          400: '#1EEFC0',
          300: '#5FF5D4',
        },
        slate: {
          850: '#1A2332',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
