const nextTranslate = require('next-translate-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, _options) => {
    config.resolve.fallback = { fs: false }

    config.plugins.push(
        new MomentLocalesPlugin({
          localesToKeep: [
            'be',
            'de',
            'es',
            'fr',
            'it',
            'nl',
            'pt',
            'ru'
          ],
        }),
    )

    return config
  },

  redirects: async () => ([
    {
      source: '/maps',
      destination: '/m/main',
      permanent: true,
    },
    {
      source: '/m',
      destination: '/m/main',
      permanent: true,
    },
    {
      source: '/t',
      destination: '/t/main',
      permanent: true,
    },
    {
      source: '/tables',
      destination: '/t/main',
      permanent: true,
    },
    {
      source: '/tables/:path*',
      destination: '/t/:path*',
      permanent: true,
    },
    {
      source:'/renn.html/:slug*',
      destination: 'https://v0.kartevonmorgen.org/renn.html#/:slug*',
      permanent: false
    },
    {
      source:'/businesscard.html/:slug*',
      destination: 'https://v0.kartevonmorgen.org/businesscard.html#/:slug*',
      permanent: false
    },
    {
      source:'/map.html/:slug*',
      destination: 'https://v0.kartevonmorgen.org/map.html#/:slug*',
      permanent: false
    },
    {
      source:'/mapAndEntryList.html/:slug*',
      destination: 'https://v0.kartevonmorgen.org/mapAndEntryList.html#/:slug*',
      permanent: false
    }
  ]),

  i18n: {
    locales: [
      'be',
      'de',
      'en',
      'es',
      'fr',
      'it',
      'nl',
      'pt',
      'ru'
    ],

    defaultLocale: 'de',
  },

}

module.exports = nextTranslate(withBundleAnalyzer(nextConfig))
