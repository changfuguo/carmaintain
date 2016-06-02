/**
 * Lark Application - index.js
 * Copyright(c) 2015 lark-team
 * MIT Licensed
 */
'use strict';
   
import  'babel-polyfill';
import lark from 'lark';
import 'isomorphic-fetch';
import './lib/BaseController'
import webpack from 'webpack'
import webpackDevMiddleware from 'koa-webpack-dev-middleware'
import webpackHotMiddleware from 'koa-webpack-hot-middleware'

const config = require('./build/config.build');
/*build client for server render**/

let {__DEV__,__PROD__} = config.globals;

let app = lark();

/**here is a demo bu using fetch and promise**/
/***
var sleep = function (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, time);
  })
};
var start = async function () {
  // 在这里使用起来就像同步代码那样直观
  console.log('start');
  await sleep(3000);
  console.log('end');
};
start();
**/
if(__DEV__) {

  	let chokidar = require('chokidar');
  	let watcher = chokidar.watch(['./lib/**/*.js','./index.js','./controllers/**/*.js','./models/**/*.js','./config/**/*.js']);
  	let debugpath = require('path');
	watcher.on('ready', () => {
	  	watcher.on('all', (event, path) =>{
		    console.log("Clearing /server/ module cache from server");
		    console.log(event + ':' + path)
		    var fullPath = debugpath.resolve(__dirname, path);
		    if(require.cache[fullPath]) {
		    	console.log(`exist ${fullPath}`)
		    	delete require.cache[fullPath];

		    	require(fullPath);
		    }
		    // Object.keys(require.cache).forEach(function(id) {
		    //   if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
		    // });
	  	});
	});
    let webpackConfig = null;
    webpackConfig = require('./webpack.config.dev')(config);
    const compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleware(compiler, { 
      stats: {
        color: true
      },
      inline:true,
      lazy:false,
      hot: true,
      noInfo: true, 
      publicPath: webpackConfig.output.publicPath,
      headers: {'Access-Control-Allow-Origin': '*'},
      //contentBase: "http://" + config.server_host + ':' + config.server_port,
      quiet: true
    }))
    app.use(webpackHotMiddleware(compiler));
} else if(__PROD__){
     
    // we do nothing in prod envrioment 
}
console.log(`start ${__DEV__}  i am here dd aaa`)
app.run(function (port) {
  console.log('running on', port);
});

