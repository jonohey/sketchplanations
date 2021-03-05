module.exports = {
  i18n: {
    locales: ['en-GB'],
    defaultLocale: 'en-GB',
  },
  images: {
    loader: 'imgix',
    path: 'https://images.prismic.io/sketchplanations/',
    domains: ['images.prismic.io'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        request: 'empty',
      }
    }

    return config
  },
}
