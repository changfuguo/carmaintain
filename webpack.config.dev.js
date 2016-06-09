var path = require('path')
var webpack = require('webpack')

module.exports = function(config){
    console.log('dev:',__dirname)
    var webpackConfig = {
        devtool: 'cheap-module-source-map',
        entry: {
            app:[
                'webpack-hot-middleware/client?path=http://' + config.server_host + ':' + config.server_port + '/__webpack_hmr&timeout=20000&reload=true',
                './src/client/static/js/client.js'
            ],
            vendor: ["react", "react-redux", "react-router","react-dom","redux", "redux-thunk"]
        },
        output: {
            path: config.path.base + '/statics/static/js',
            //filename: '[name]-[chunkhash:8].js',
            filename: '[name].js',
            //chunkFilename: "[id].bundle.js",
            publicPath: '/static/js'//config.server_host + ':'+ config.server_port + '/static/js'
        },
        plugins: [
        	new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js'),
        	new webpack.optimize.DedupePlugin(),// 优化的模块，不需要重复加载相同模块
            new webpack.optimize.OccurenceOrderPlugin(), //按照出现的顺序打包
            new webpack.HotModuleReplacementPlugin(), //热体验用的
            new webpack.NoErrorsPlugin()
        ],
        progress: true,
		resolve: {
		    modulesDirectories: [
		      'src',
		      'node_modules'
		    ],
		    extensions: ['', '.json', '.js', '.jsx']
		},
        //watch:true ,
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
