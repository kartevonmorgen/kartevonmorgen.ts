module.exports = {
  webpack: (config, _) => {
    return config
  },
  redirects: async () => ([
    {
      source: '/maps',
      destination: '/maps/main',
      permanent: true
    },
    {
      source: '/tables',
      destination: '/tables/kvm',
      permanent: true
    }
  ])
}