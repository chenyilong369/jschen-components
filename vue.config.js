// vue.config.js
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isAnalyzeMode = !!process.env.ANALYZE_MODE

module.exports = {
  configureWebpack: (config) => {
    if (isAnalyzeMode) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static'
        })
      )
    }
    config.plugins.push(
      new webpack.IgnorePlugin({
        
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
    )
    config.optimization.splitChunks = {
      maxInitialRequests: Infinity,
      minSize: 300 * 1024,
      chunks: 'all',
      cacheGroups: {
        antVendor: {
          test: /[\\/]node_modules[\\/]/,
          name: (module) => {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            return `npm.${packageName.replace('@', '')}`
          }
        },
      }
    }
  },
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    }),
      config.plugin('html').tap((args) => {
        Object.assign(args[0], {
          title: '拖拖艺术',
          desc: '实现你的 h5 页面吧'
        })
        return args
      })
  }
}