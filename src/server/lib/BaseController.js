'use strict';

/**
* @file 封装基础的方法，参见叮咚老师的action.js
* @author changfuguo
* @date 2016-05-30
*/

import './server'
class BaseController{
	constructor(needlogin){
		this.needlogin = !!needlogin;
		this.view = view || 'index';
	}

	start(){
		var me = this;
		return function(router) {

			router.get('/*', function*(next){
				// 这里this已经指向了ctx
				if((this.originalUrl || '').toLowerCase().indexOf('/api/') === 0) {
					yield me.executeAPIAction(this);
				} else {
					yield me.executeAction(this);
				}
				yield next;
			});

			return router;
		}
	}

	* executeAction(ctx){
		let me = this;
		try{
			yield this.checkLogin(ctx);
			this.checkParams && this.checkParams(ctx);
			let data = yield this.execute(ctx);
			data = renderReact(ctx.path, data, ctx);
			ctx.render('index.ejs', {html: data.html, initialState: data.state});
		} catch(err) {
			ctx.render('error.ejs', {message: err})
		}
	}

	* executeAPIAction(ctx){

		let res = {};
		try{
			yield this.checkLogin(ctx);
			this.checkParams && this.checkParams(ctx);
			let data = yield this.execute(ctx);

			res = {
				errno: 0,
				msg: '',
				data: data
			}

		} catch(err) {
			res = {
				errno: 1 ,
				msg: err
			}
		}
		var output = JSON.stringify(res);
		output = this.checkJSONP(ctx, output);
		ctx.set('Content-Type', 'application/json;charset=UTF-8');
		ctx.ctx.body = output;
	}
	* checkLogin(){

	}
	checkJSONP(){
		var cb = (ctx.query.callback || '').replace(/(^\s+|\s+$)/g, '');
		if(cb && cb.match(/^[a-zA-Z_][a-zA-Z0-9\._]*$/)) {
			str = '/**/' + cb + '(' + str + ');';
		}
		return str;
	}

	checkParams(){

	}
}
// exports to global
exports.default = global.BaseController = BaseController;

