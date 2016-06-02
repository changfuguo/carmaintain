var path = require('path')
var webpack = require('webpack')

module.exports = function(config){
    console.log('dev:',__dirname)
    var webpackConfig = {
        devtool: 'inline-source-map',
        entry: {
            app:[
                'webpack-hot-middleware/client?path=http://' + config.server_host + ':' + config.server_port + '/__webpack_hmr&timeout=20000&reload=true',
                './src/client/static/js/client.js'
            ]
        },
        output: {
            path: config.path.base + '/statics/static/js',
            filename: '[name].js',
            publicPath: '/static/js'//config.server_host + ':'+ config.server_port + '/static/js'
        },
        plugins: [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ],
        module: {
            loaders: [
              {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                include: __dirname,
                query: {
                    cacheDirectory: true,
                    plugins: [
                        ['react-transform', {
                            transforms: [
                                { 
                                    transform: 'react-transform-hmr',
                                    imports: [ 'react' ],
                                    locals: [ 'module' ]
                                }
                            ]
                        }],
                        'transform-runtime'
                    ],
                    presets: ['es2015', 'react', 'stage-3'],

                }
              }
            ]
        }                                   
    }

    return webpackConfig;
}
