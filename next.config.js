module.exports = {
  async rewrites() {
    return [
      {
        source: '/post/:slug*/amp',
        destination: '/post/:slug',
      },
    ]
  },
}
