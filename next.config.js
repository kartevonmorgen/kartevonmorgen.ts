const nextTranslate = require('next-translate')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})


module.exports = nextTranslate(
    withBundleAnalyzer({
        future: {
            webpack5: true,
        },

        webpack: (config, _options) => {
            config.plugins.push(
                new MomentLocalesPlugin({
                    localesToKeep: ['en', 'de', 'es', 'pt', 'ru'],
                }),
            );

            config.resolve.fallback = {fs: false};

            return config;
        },

        redirects: async () => [
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
        ],

        i18n: {
            locales: ['en', 'de', 'fr', 'nl', 'es', 'ru'],

            defaultLocale: 'ru',
        },

        cssModules: true,
    }),
);