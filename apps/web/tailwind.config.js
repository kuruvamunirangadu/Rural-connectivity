/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#070B14',
          card: '#0D1322',
          border: '#1E293B',
          cyan: '#06B6D4',
          emerald: '#10B981',
          neon: '#22C55E',
          laser: '#8B5CF6',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      backgroundImage: {
        'cyber-grid': 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 1px, transparent 1px)',
        'hud-glow': 'radial-gradient(600px circle at 50% 0%, rgba(16, 185, 129, 0.15), transparent 40%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.2))' },
        },
        radarSweep: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
