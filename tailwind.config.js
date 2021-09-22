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
    },
    extend: {
      colors: {
        black: '#222',
        paper: '#fbf8de',
        red: '#BA3C3E',
        'bright-red': '#FD4C2B',
        blue: '#1253B5',
      },
    },
  },
  variants: {},
  plugins: [],
}
