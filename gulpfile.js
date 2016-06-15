'use strict';
var gulp =require('gulp');
var shell =require( 'gulp-shell');
var config = require('./build/config.build');
var runSequence =require( 'run-sequence');

 
//lark 启动
gulp.task('start', function (cb) {
    shell.task(['killall -9 node']);
        
    var cmd = './node_modules/lark/bin/lark restart';
    if(config.globals__DEV__){
    	cmd = 'NODE_ENV=development '+ cmd
    }
    shell.task([
    	cmd
    ])();
    cb();
});


require('./build/gulp.server');
require('./build/gulp.client');

gulp.task('build',['client-build','server-build'], function(cb){
	shell.task([
        ` cd  ${config.path.base}/dist && tar -czvf output.tar.gz *`,
        ` mv ${config.path.base}/dist/output.tar.gz ${config.path.base}`
    ])(cb)
})

gulp.task('watch',['server-watch'],function(cb){
    runSequence('client-watch',cb);
});

gulp.task('copy',['server-copy','client-copy'],function(cb){
	cb();
})

gulp.task('clean',function(cb){

    shell.task([
        'cd ' + config.path.base,
        ' rm -rf lib models views controllers lib config index.js',
        'rm -rf ' + config.path.distServer + ' ' + config.path.distClient 
    ])(cb)
})
// 开发环境，npm命令注册过来NODE_ENV=devolpment
gulp.task('dev',['client-client','build','watch'], function(cb) {
	runSequence('copy','start',cb);
});



/*

dev |-- client-client

    |-- build
        |-- server-build
            |-- server-compile
                |-- server-compile-js
                |-- server-compile-json
        |-- client-build
            |-- client-server
    |-- watch

    ------------>
        |---- copy
        |---- start







***/







// 线面是两个实验，watch的时候先执行test，这个时候watch的cb必须执行
// 否则在后边的change事件由于上面没有执行cb而阻塞不执行
// 另外一个 放到['test']后面是不执行的，必须用watch的change事件才能执行
// 可以测试 gulp watch-test
// shell.task cb可以放到里面去
gulp.task('test',function(cb){
	shell.task(['ls -l'])(function(err){
        console.log('test over');
        cb();
    })
	
})
gulp.task('watch-test',function(cb){
	var watcher = gulp.watch(config.path.client + '/**/*',['start']);
	watcher.on('change', function (event) {
   		console.log('Event type: ' + event.type); // added, changed, or deleted
   		console.log('Event path: ' + event.path); // The path of the modified file
	});
	cb();
})
