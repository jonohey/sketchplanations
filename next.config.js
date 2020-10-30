module.exports = {
  async rewrites() {
    return [
      {
        source: '/post/:id/:slug/amp',
        destination: '/post/:id/:slug',
      },
    ]
  },
}
