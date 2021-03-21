const MomentLocalesPlugin = require('moment-locales-webpack-plugin')


module.exports = {
  webpack: (config, _) => {
    config.plugins.push(
      new MomentLocalesPlugin({
        localesToKeep: ['es-us', 'ru', 'de', 'es', 'fa'],
      }),
    )

    return config
  },
  redirects: async () => ([
    {
      source: '/maps',
      destination: '/maps/main',
      permanent: true,
    },
    {
      source: '/tables',
      destination: '/tables/kvm',
      permanent: true,
    },
  ]),
  env: {
    PORT: 8000,
  },
}