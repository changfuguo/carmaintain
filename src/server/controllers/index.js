'use strict';

class IndexController extends BaseController{

	constructor(){
		super(true)
	}

	* execute(ctx) {

		return new Promise( (resolve, reject) =>{
			resolve({counter: 3344})
		})
	}
}
// console.log(2) 

module.exports = new IndexController().start();
