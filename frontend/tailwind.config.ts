import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#5b5cf6',
          700: '#4f46e5',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        surface: 'var(--surface)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--primary-gradient)',
        'gradient-secondary': 'var(--secondary-gradient)',
        'gradient-accent': 'var(--accent-gradient)',
      },
      boxShadow: {
        'glass': 'var(--shadow)',
        'glass-lg': 'var(--shadow-lg)',
        'purple': 'var(--shadow-purple)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
} satisfies Config
