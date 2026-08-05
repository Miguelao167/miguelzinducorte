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
        'bg-primary': '#ffffff',
        'bg-secondary': '#f5f8fc',
        'bg-tertiary': '#eaf2fb',
        'accent-primary': '#0066cc',
        'accent-secondary': '#003d80',
        'accent-tertiary': '#00a3ff',
        'accent-light': '#e6f1ff',
        'text-primary': '#0a1f3d',
        'text-secondary': '#4a6b8a',
        'text-muted': '#7a93ad',
      },
      fontFamily: {
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 4px 20px rgba(0, 102, 204, 0.15)',
        'glow-md': '0 8px 40px rgba(0, 102, 204, 0.2)',
        'glow-lg': '0 12px 60px rgba(0, 102, 204, 0.25)',
        'glow-xl': '0 16px 80px rgba(0, 102, 204, 0.3)',
        'card-light': '0 4px 24px rgba(0, 61, 128, 0.08)',
        'card-light-hover': '0 12px 48px rgba(0, 102, 204, 0.18)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 4px 20px rgba(0, 102, 204, 0.2)' },
          '50%': { boxShadow: '0 8px 30px rgba(0, 102, 204, 0.35)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '400%': '400% 400%',
      },
    },
  },
  plugins: [],
}

export default config
