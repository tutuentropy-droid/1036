/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        vhs: {
          black: '#0a0a0a',
          dark: '#121212',
          gray: '#1a1a2e',
          green: '#39ff14',
          purple: '#c77dff',
          pink: '#ff6b9d',
          blue: '#00d4ff',
          yellow: '#ffff00',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        terminal: ['VT323', 'monospace'],
      },
      animation: {
        'scanline': 'scanline 3s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'glitch': 'glitch 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink-caret': 'blinkCaret 0.75s step-end infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.98' },
        },
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '92%': { transform: 'translate(-2px, 2px)' },
          '94%': { transform: 'translate(2px, -2px)' },
          '96%': { transform: 'translate(-2px, -2px)' },
          '98%': { transform: 'translate(2px, 2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blinkCaret: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#39ff14' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
