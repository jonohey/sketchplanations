module.exports = {
  i18n: {
    locales: ['en-GB'],
    defaultLocale: 'en-GB',
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
