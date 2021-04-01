const MomentLocalesPlugin = require('moment-locales-webpack-plugin')


module.exports = {

  webpack: (config, _) => {
    config.plugins.push(
      new MomentLocalesPlugin({
        localesToKeep: [
          'en',
          'de',
          'fr',
          'nl',
          'es',
          'ru',
        ],
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

  i18n: {
    locales: [
      'en',
      'de',
      'fr',
      'nl',
      'es',
      'ru',
    ],

    defaultLocale: 'de',
  },

}