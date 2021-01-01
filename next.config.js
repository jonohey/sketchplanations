module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        request: 'empty',
      }
    }

    return config
  },
}
