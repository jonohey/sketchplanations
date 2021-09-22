module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.js', './components/**/*.js'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      light: { raw: '(prefers-color-scheme: light)' },
      dark: { raw: '(prefers-color-scheme: dark)' },
    },
    extend: {
      colors: {
        black: 'var(--color-black)',
        paper: 'var(--color-paper)',
        red: 'var(--color-red)',
        brightRed: 'var(--color-brightRed)',
        blue: 'var(--color-blue)',
        bg: 'var(--color-bg)',
        bgTransparent: 'var(--color-bgTransparent)',
        bgDarker: 'var(--color-bgDarker)',
        border: 'var(--color-border)',
        inputBg: 'var(--color-inputBg)',
        inputBorder: 'var(--color-inputBorder)',
      },
    },
  },
  variants: {},
  plugins: [],
}
