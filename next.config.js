module.exports = {
  webpack: (config, _) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      loader: "file-loader",
      options: {
        outputPath: '../public/assets/', // if you don't use ../ it will put it inside ".next" folder by default
        publicPath: 'assets/',
      }
    });

    return config
  },
}