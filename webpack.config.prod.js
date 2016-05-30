var path = require('path')
var webpack = require('webpack')

module.exports = function(config){
    var webpackConfig = {
        devtool: 'inline-source-map',
        entry: {
            app:[
                './src/client/static/js/client.js'
            ]
        },
        output: {
            path: config.path.distClient + '/static/js',
            filename: '[name].js',
            publicPath: config.server_host + ':'+ config.server_port + '/static/'
        },
        plugins: [
             
        ],
        module: {
            loaders: [
              {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                include: __dirname,
                query: {
                  presets: ['es2015', 'react', 'stage-3'],
                }
              }
            ]
        }                                   
    }

    return webpackConfig;
}
