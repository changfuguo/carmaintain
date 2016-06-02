'use strict';

class IndexController extends BaseController{

	constructor(){
		super(true)
	}

	* execute(ctx) {

		return new Promise( (resolve, reject) =>{
			resolve({counter: 33})
		})
	}
}
// console.log(2) 

module.exports = new IndexController().start();
