/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        display: ['"Silkscreen"', 'monospace'],
      },
      colors: {
        blood: {
          light: '#ff3366',
          DEFAULT: '#e60039',
          dark: '#800020',
          darkest: '#3a000f',
        },
        toxic: {
          glow: '#5bfb6c',
          DEFAULT: '#00ff41',
          dim: '#15803d',
          dark: '#052e16',
        },
        arcade: {
          cyan: '#00f0ff',
          yellow: '#ffe600',
          purple: '#b026ff',
          orange: '#ff6c00',
        },
        crt: {
          bg: '#09080e',
          card: '#12101b',
          border: '#2a2238',
          scanline: 'rgba(18, 16, 27, 0.75)',
        }
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px 0px rgba(0, 0, 0, 1)',
        'pixel': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'pixel-lg': '6px 6px 0px 0px rgba(0, 0, 0, 1)',
        'pixel-blood': '4px 4px 0px 0px #800020',
        'pixel-toxic': '4px 4px 0px 0px #052e16',
        'glow-red': '0 0 15px rgba(230, 0, 57, 0.65)',
        'glow-green': '0 0 15px rgba(0, 255, 65, 0.65)',
        'glow-cyan': '0 0 15px rgba(0, 240, 255, 0.65)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'crt-flicker': 'flicker 0.15s infinite',
        'float': 'float 2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.98' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
