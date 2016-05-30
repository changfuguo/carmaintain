var gulp =require('gulp');
var babel =require( 'gulp-babel');
var del =require('del');
var config = require('./config.build');
var modules = config.modules, babelConfig = config.babelConfig;
var shell =require( 'gulp-shell');
var path =require( 'path');
var changed  =require( 'gulp-changed');
var runSequence =require( 'run-sequence');
/**compile modules to dist**/

 //clean server 
gulp.task('server-clean',function(cb){
	
	del(config.path.distServer + '/**',{force: true}).then(function(paths){
		cb();
	});
});


gulp.task('server-compile-js', function(cb){

	var ms = [];
	modules.forEach(function(module, index){
		ms.push(`${config.path.modules[module]}/**/*.js` )
	});

	ms.push(`${config.path.server}/index.js`);
	return gulp.src(ms, {base: './src/server' })
	.pipe(babel(babelConfig))
	.pipe(gulp.dest('dist/server'),function() {
		cb();
	});
});


gulp.task('server-compile-json', function(cb){

	var ms = [];
	modules.forEach(function(module, index){
		ms.push(`${config.path.modules[module]}/**/*.json` )
	});
	return gulp.src(ms, {base: './src/server'})
	.pipe(gulp.dest('dist/server'), function(){
		cb();
	});
});

gulp.task('server-compile',['server-compile-js','server-compile-json'], function(cb){
	cb();
});

/**compile when file changed***/
gulp.task('server-changed-js', function(cb){

	var  ms = [];
	modules.forEach(function(module, index){
		ms.push(`${config.path.modules[module]}/**/*.js` )
	});

	ms.push(`${config.path.server}/index.js`);
	
	return gulp.src(ms, {base: './src/server' })
	.pipe(changed('./'))
	.pipe(babel(babelConfig))
	.pipe(gulp.dest('./'),function() {
		cb();
	});
});
gulp.task('server-changed-json', function(cb) {

	var ms = [];
	modules.forEach(function(module, index){
		ms.push(`${config.path.modules[module]}/**/*.json` )
	});
	return gulp.src(ms, {base: './src/server'})
	.pipe(gulp.dest('./'), function() {
		cb();
	});
});

gulp.task('server-changed',['server-changed-js','server-changed-json'], function(cb)  {
	cb();
});



/**copy dist to destination***/
gulp.task('server-copy', function(cb) {
	shell.task([
        `cp -rf  ${config.path.distServer}/*  ${config.path.base}`
    ])();
	
	setTimeout(function() { cb() }, 10);
});

gulp.task('server-clean-prod',function(cb) {
	var cmds = [];
	cmds.push(`${config.path.base}/index.js`);
	config.modules.forEach(function(value, index) {
		cmds.push(`${config.path.base}/${value}`)
	});

	del(cmds,{force: true}).then(function(paths) {
		cb();
	});
});

gulp.task('server-watch', function (cb) {
    var watcher = gulp.watch([config.path.server + '/**/*'], ['server-changed']);

    watcher.on('change', function (event) {
    	console.log('after server changed:' + event.path)
        runSequence('server-copy','start')
        //console.log('Event type: ' + event.type); // added, changed, or deleted
        //console.log('Event path: ' + event.path); // The path of the modified file
    });
    cb();
});

gulp.task('server-build', function(cb) {
	runSequence(['server-clean', 'server-clean-prod'], 'server-compile', cb);
})

// gulp.task('default',function(cb) {
// 	runSequence('server-watch','start');
// });