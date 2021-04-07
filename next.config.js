module.exports = {
  i18n: {
    locales: ['en-GB'],
    defaultLocale: 'en-GB',
  },
  images: {
    loader: 'imgix',
    path: '',
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
  async redirects() {
    return [
      {
        source: '/styleguide',
        destination: 'https://company-208276.frontify.com/d/iATaeFQL51Lv',
        permanent: false,
      },
    ]
  },
}
