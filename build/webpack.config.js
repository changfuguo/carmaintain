var webpack = require('webpack')
var config =require('./config.build')

var __DEV__ = config.globals.__DEV__;
var __PROD__ = config.globals.__PROD__;
 
var webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: config.compiler_devtool,
  resolve: {
    root: config.path.base,
    extensions: ['', '.js', '.jsx', '.json']
  },
  module: {}
}


var APP_ENTRY_PATH = config.path.client + '/static/js/client.js';

webpackConfig.entry = {
  app: [APP_ENTRY_PATH],
  lib: config.compiler_vendor
}

webpackConfig.output = {
  filename: `[name].[${config.compiler_hash_type}].js`,
  path: config.path.distClient + '/static/',
  publicPath: config.compiler_public_path + 'static/js/'
}


webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals)
]


//loaders 
webpackConfig.module.loaders = [{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    cacheDirectory: true,
    plugins: ['transform-runtime'],
    presets: ['es2015', 'react', 'stage-3'],
    env: {
      production: {
        presets: ['react-optimize']
      }
    }
  }
},
{
  test: /\.json$/,
  loader: 'json'
}]
/*
webpackConfig.externals = {
    'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
    }
}

webpackConfig.resolve ={
    alias:{
       	react:path.join(node_modules,'./react/dist/react.min.js'),
	}
}
*/
webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js'));

if (__DEV__) {
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
} else if (__PROD__) {
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  )
}


module.exports = webpackConfig;