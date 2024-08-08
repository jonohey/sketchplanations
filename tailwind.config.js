module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xxs: '380px',
      maxXxs: { max: '379px' },
      xs: '480px',
      maxXs: { max: '479px' },
      sm: '640px',
      maxSm: { max: '639px' },
      md: '768px',
      maxMd: { max: '767px' },
      lg: '1024px',
      maxLg: { max: '1023px' },
      xl: '1280px',
      maxXl: { max: '1279px' },
      light: { raw: '(prefers-color-scheme: light)' },
      dark: { raw: '(prefers-color-scheme: dark)' },
    },
    extend: {
      opacity: ['group-hover'],
      colors: {
        black: 'var(--color-black)',
        paper: 'var(--color-paper)',
        paperDarker: 'var(--color-paperDarker)',
        red: 'var(--color-red)',
        brightRed: 'var(--color-brightRed)',
        blue: 'var(--color-blue)',
        blueLight: 'var(--color-blueLight)',
        bg: 'var(--color-bg)',
        bgTransparent: 'var(--color-bgTransparent)',
        bgDarker: 'var(--color-bgDarker)',
        bgHighlight: 'var(--color-bgHighlight)',
        border: 'var(--color-border)',
        inputBg: 'var(--color-inputBg)',
        inputBorder: 'var(--color-inputBorder)',
        subduedText: 'var(--color-subduedText)',
        buttonBg: 'var(--color-buttonBg)',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-text)',
            '--tw-prose-headings': 'var(--color-text)',
            '--tw-prose-lead': 'var(--color-text)',
            '--tw-prose-links': 'var(--color-blue)',
            '--tw-prose-bold': 'var(--color-text)',
            '--tw-prose-counters': 'var(--color-text)',
            '--tw-prose-bullets': 'var(--color-text)',
            '--tw-prose-hr': 'var(--color-text)',
            '--tw-prose-quotes': 'var(--color-text)',
            '--tw-prose-quote-borders': 'var(--color-text)',
            '--tw-prose-captions': 'var(--color-text)',
            '--tw-prose-code': 'var(--color-text)',
            '--tw-prose-pre-code': 'var(--color-text)',
            '--tw-prose-pre-bg': 'var(--color-bgHighlight)',
            '--tw-prose-th-borders': 'var(--color-text)',
            '--tw-prose-td-borders': 'var(--color-text)',
            '--tw-prose-invert-body': 'var(--color-text)',
            '--tw-prose-invert-headings': 'var(--color-text)',
            '--tw-prose-invert-lead': 'var(--color-text)',
            '--tw-prose-invert-links': 'var(--color-text)',
            '--tw-prose-invert-bold': 'var(--color-text)',
            '--tw-prose-invert-counters': 'var(--color-text)',
            '--tw-prose-invert-bullets': 'var(--color-text)',
            '--tw-prose-invert-hr': 'var(--color-text)',
            '--tw-prose-invert-quotes': 'var(--color-text)',
            '--tw-prose-invert-quote-borders': 'var(--color-text)',
            '--tw-prose-invert-captions': 'var(--color-text)',
            '--tw-prose-invert-code': 'var(--color-text)',
            '--tw-prose-invert-pre-code': 'var(--color-text)',
            '--tw-prose-invert-pre-bg': 'var(--color-bgHighlight)',
            '--tw-prose-invert-th-borders': 'var(--color-text)',
            '--tw-prose-invert-td-borders': 'var(--color-text)',
            h1: {
              fontWeight: '600',
            },
            'h1 strong': {
              fontWeight: '600',
            },
            h2: {
              fontWeight: '600',
            },
            'h2 strong': {
              fontWeight: '600',
            },
            'h3 strong': {
              fontWeight: '600',
            },
            'h4 strong': {
              fontWeight: '600',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
