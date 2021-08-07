const nextTranslate = require('next-translate')
const withAntdLess = require('next-plugin-antd-less')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})


module.exports = nextTranslate(
  withBundleAnalyzer(
    withAntdLess({

      future: {
        webpack5: true,
      },

      webpack: (config, _options) => {
        config.plugins.push(
          new MomentLocalesPlugin({
            localesToKeep: [
              'en',
              'de',
              'es',
              'pt',
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

      cssModules: true,

    }),
  ),
)