const fs = require('fs')
const path = require('path')

module.exports = {
  exportPathMap: async (defaultPathMap, config) => {
    const { dir } = config
    const pages = {
      '/': { page: '/' },
    }
    return pages
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre',
    })
    return config
  },
}
