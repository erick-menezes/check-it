const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['PlusJakartaSans-Regular'],
        regular: ['PlusJakartaSans-Regular'],
        medium: ['PlusJakartaSans-Medium'],
        semibold: ['PlusJakartaSans-SemiBold'],
        bold: ['PlusJakartaSans-Bold'],
        extrabold: ['PlusJakartaSans-ExtraBold'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        checkit: {
          primary: '#58AB6A',
          'primary-dark': '#479A59',
          accent: '#F2B807',
          danger: '#E13E3E',
          info: '#5180F9',
          'warm-oat': '#ECEAE3',
          'linen-cream': '#F7F6F2',
          'fog-gray': '#EBEBEB',
          'mist-border': '#E3E3E3',
          'charcoal-ink': '#1B1B1B',
          'slate-ink': '#3D3D4D',
          'pebble-gray': '#8A8A8A',
          'lavender-stone': '#BAB7C5',
          'grocery-label-color': '#F2B807',
          'grocery-label-tint': 'rgba(242, 184, 7, 0.18)',
          'produce-label-color': '#58AB6A',
          'produce-label-tint': 'rgba(88, 171, 106, 0.18)',
          'butcher-label-color': '#E13E3E',
          'butcher-label-tint': 'rgba(225, 62, 62, 0.18)',
          'hygiene-label-color': '#5180F9',
          'hygiene-label-tint': 'rgba(81, 128, 249, 0.18)',
          'cleaning-label-color': '#7A5AE0',
          'cleaning-label-tint': 'rgba(122, 90, 224, 0.18)',
          'drinks-label-color': '#3DA9C7',
          'drinks-label-tint': 'rgba(61, 169, 199, 0.18)',
          'other-label-color': '#8A8A8A',
          'other-label-tint': 'rgba(138, 138, 138, 0.18)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
