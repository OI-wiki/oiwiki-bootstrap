const path = require('path')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules/gatsby-theme-oi-wiki/node_modules'),
        path.resolve(__dirname, 'src'),
        'node_modules'
      ],
    },
  })
}

