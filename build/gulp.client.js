var gulp =require('gulp');
var babel =require( 'gulp-babel');
var del =require('del');
var config = require('./config.build');
var modules = config.modules, babelConfig = config.babelConfig;
var shell =require( 'gulp-shell');
var path =require( 'path');
var changed  =require( 'gulp-changed');
var runSequence =require( 'run-sequence');
var gulpWebpack = require('gulp-webpack');
var webpack =  require('webpack')
var config = require('./config.build');
/*build client for server render**/
var webpackConfig = null;
var __DEV__ = config.globals.__DEV__;
var __PROD__ = config.globals.__PROD__;


var TASKS_CLIENT_COPY = [];
var TASKS_CLIENT_BUILD = [];
var SERVER_JS_PATH = '';
var VIEWS_PATH = '';

if(__DEV__) {
    TASKS_CLIENT_COPY = ['client-copy-views','client-copy-server'];
    TASKS_CLIENT_BUILD =  ['client-server','client-views']
    webpackConfig = require('../webpack.config.dev')(config);
    SERVER_JS_PATH = config.path.base + '/lib';
    VIEWS_PATH = config.path.base ;
} else if(__PROD__){
    TASKS_CLIENT_COPY = ['client-copy-views','client-copy-server'];
    TASKS_CLIENT_BUILD =  ['client-client','client-server','client-views']
    webpackConfig = require('../webpack.config.prod')(config);
    SERVER_JS_PATH = config.path.distServer + '/lib';
    VIEWS_PATH = config.path.distClient ;
}

// no mode was designed, throw error
if (webpackConfig == null) {
    console.log('no mode was designed,please assign a mode at least');
    return false;
}

/**
* 服务端渲染，这里不做开发环境和线上环境的区分，实在服务端执行所以直接打到lib里
*/
gulp.task('client-server', function(cb){

    webpack({
        entry: {
            server: "./src/client/static/js/server.js"
        },
        output: {
            filename: 'server.js',
            path:SERVER_JS_PATH
        },
        module: {
            loaders:[
                {
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
                    }
            ]
        }
    }, function(err, stats){
        if(err){
            console.log(err)
        } else {
            cb()
        }
    })
})

// build client 
gulp.task('client-client', function(cb){
    webpack(webpackConfig,function(err, stats){
        if (err) {
            console.log(err)
        } else {
            cb();
        }
    })
})


gulp.task('client-views', function(cb){
    return gulp.src(`${config.path.client}/views/**/*`,{base: './src/client'})
    .pipe(gulp.dest(`${VIEWS_PATH}`),function(){
        cb();
    })
});

gulp.task('client-copy-client', function(cb){
    shell.task([
        `cp -rf  ${config.path.distClient}/static/js/bundle.js  ${config.path.base}/statics/static/app.js`
    ])();
    
    setTimeout(function() { cb() }, 10);
})
gulp.task('client-copy-server', function(cb){
    shell.task([
        `cp -rf  ${config.path.distClient}/static/js/server.js  ${config.path.base}/lib/server.js`
    ])();
    
    setTimeout(function() { cb() }, 10);
});

gulp.task('client-copy-views', function(cb){
    console.log(`cp -rf  ${config.path.distClient}/views/**/*  ${config.path.base}/views/`)
    shell.task([
        `cp -rf  ${config.path.distClient}/views  ${config.path.base}/views`
    ])(cb);
    
    
});


gulp.task('client-copy', TASKS_CLIENT_COPY, function(cb) {
    cb();
});



gulp.task('client-build',TASKS_CLIENT_BUILD, function(cb) {
    cb();
});

gulp.task('client-watch-views', function(cb){
    var watcher = gulp.watch(config.path.client+'/views/**/*',['client-views']);
    // watcher.on('change', function (event) {
    //     runSequence('client-copy-views')
    //     //console.log('Event type: ' + event.type); // added, changed, or deleted
    //     //console.log('Event path: ' + event.path); // The path of the modified file
    // });
    cb();
});
gulp.task('client-watch-server', function(cb){
    var watcher = gulp.watch(config.path.client+'/static/**/*',['client-server']);
    watcher.on('change', function (event) {
        runSequence('start')
        //console.log('Event type: ' + event.type); // added, changed, or deleted
        //console.log('Event path: ' + event.path); // The path of the modified file
    });
    cb();
});

gulp.task('client-watch',['client-watch-views','client-watch-server'], function(cb){
    cb();
});







