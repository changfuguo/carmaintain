var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(config){
    var webpackConfig = {
        devtool: 'cheap-module-source-map',
        entry: {
            app:[
                './src/client/static/js/client.js'
            ],
            vendor: ["react", "react-redux", "react-router", "redux", "redux-thunk"]
        },
        output: {
            path: config.path.distClient + '/static/js',
            filename: '[name].js',
            publicPath: config.server_host + ':'+ config.server_port + '/static/'
        },
        plugins: [
        	new ExtractTextPlugin("[name].css"),
        	new webpack.optimize.DedupePlugin(), // 优化的模块，不需要重复加载相同模块
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.DefinePlugin({
              'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                '__BROWSER__':true
              }
            }),
            new webpack.optimize.UglifyJsPlugin({
              compressor: {
                warnings: false
              }
            })
        ],
        progress: true,
		resolve: {
		    modulesDirectories: [
		      'src',
		      'node_modules'
		    ],
		    extensions: ['', '.json', '.js', '.jsx']
		},
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
              },{
				    test: /\.scss$/, 
				    //loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap' 
				    //loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!sass?outputStyle=expanded&sourceMap' 
				    //loader: 'style!css!sass?outputStyle=expanded&sourceMap' 
				    loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
					
				}
            ]
        }                                   
    }

    return webpackConfig;
}
