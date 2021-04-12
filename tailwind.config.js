module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        black: '#010101',
        paper: '#fbf8de',
        'paper-dark': '#ebe7d0',
        'paper-darker': '#e1dec7',
        'paper-darkest': '#bcb5a5',
        red: '#ba3c3e',
        'bright-red': '#fd4c2b',
        blue: '#1253b5',
      },
    },
  },
  variants: {},
  plugins: [],
}
