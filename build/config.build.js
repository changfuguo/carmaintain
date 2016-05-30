'use strict';
var  path = require('path');
var fs  = require('fs');
var rootDir = path.resolve(__dirname ,'..');
var srcDir = path.resolve(rootDir,'src');
var serverDir = path.resolve(srcDir,'server');
var clientDir = path.resolve(srcDir,'client');

var babelConfig = JSON.parse(fs.readFileSync(path.resolve(rootDir,'.babelrc'),'utf-8'));


/**modules for all*/

 
var modules = ['config','controllers','models','lib'];
var clientModules = ['views','static'];


var config = {
	env: process.env.NODE_ENV || 'development',
	path: {
		modules:{},
		clientModules: {}
	},
	modules: modules,
	babel: babelConfig,
	// ----------------------------------
	// Compiler Configuration
	// ----------------------------------
	compiler_css_modules     : true,
	compiler_devtool         : 'source-map',
	compiler_hash_type       : 'hash',
	compiler_fail_on_warning : false,
	compiler_quiet           : false,
	compiler_public_path     : '/static/',
	compiler_stats           : {
		chunks : false,
		chunkModules : false,
		colors : true
	},
	server_host : 'localhost',
	server_port : process.env.PORT || 3000,

	compiler_vendor : ["react", "react-redux", "react-router", "redux", "redux-thunk"]
};

modules.forEach(function(value, index){
	config['path']['modules'][value] = path.resolve(serverDir,value);
});


config.path['base'] = rootDir;
config.path['server'] = serverDir;
config.path['client'] = clientDir;
config.path['distServer'] = path.resolve(rootDir,'dist/server');
config.path['distClient'] = path.resolve(rootDir,'dist/client');
config.path['nodeModules'] = path.resolve(rootDir ,'./node_modules')
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env)
  },
  'NODE_ENV'     : config.env,
  '__DEV__'      : config.env === 'development',
  '__PROD__'     : config.env === 'production'
}

if(config.globals.__DEV__) {
	config.compiler_public_path = `http://${config.server_host}:${config.server_port}/`
} else {
	Object.assign(config, {
    compiler_public_path: '/',
    compiler_fail_on_warning: false,
    compiler_hash_type: 'chunkhash',
    compiler_devtool: null,
    compiler_stats: {
      chunks: true,
      chunkModules: true,
      colors: true
    }
  })
}

module.exports = config;