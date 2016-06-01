'use strict';

class IndexController extends BaseController{

	constructor(){
		super(true)
	}

	* execute(ctx) {

		return new Promise( (resolve, reject) =>{
			resolve({counter: 2000})
		})
	}
}


module.exports = new IndexController().start();