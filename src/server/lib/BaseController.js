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
	}

	route(router){
		let me = this;
		let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(me));

		methods = methods.filter((method, index)=>{
			return typeof me[method] == 'function' && method.substr(0,6) == 'Action'
		})
		methods.forEach((method, index) => {
			router.get('/' + method.substr(6).toLowerCase(), function *(next){
				let data  = yield me[method](this);
				if (this.originalUrl.indexOf('/api/') == 0) {
					data = JSON.stringify(data);
					data = me.checkJSONP(this, data);
					this.set('Content-Type', 'application/json;charset=UTF-8');
					this.body = data;
				} else {
					data = yield renderReact(data, this);
					yield this.render('index.ejs', {html: data.html, initialState: data.state, htmlClassName:"index"});
					yield next;
				}
			})

		})
		return router;		 
	}

	
	* executeAPIAction(ctx){

		
	}
	* checkLogin(){

	}
	checkJSONP(ctx, str){
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
