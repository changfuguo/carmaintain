'use strict';

class IndexController extends BaseController{

	constructor(){
		super(true)
	}
	*Action(ctx) {
		return new Promise( (resolve, reject) =>{
			resolve({counter: 1111})
		})
	}
}

module.exports = function (router) {
	new IndexController().route(router)
}
