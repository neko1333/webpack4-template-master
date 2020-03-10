const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = function(options) {
  options.mode = 'production'
  options.optimization = {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        // cssProcessorOptions: cssnanoOptions,
        cssProcessorPluginOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true
              },
              normalizeUnicode: false
            }
          ]
        },
        canPrint: true
      })
    ]
  }
  return options
}
