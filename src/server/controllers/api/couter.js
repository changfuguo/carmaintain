'use strict';

class CounterAPIController extends BaseController{

	constructor(){
		super(false)
	}

	* execute(ctx) {
		return new Promise( (resolve, reject) =>{
			resolve({counter: 1000})
		})

	}
}


module.exports = new CounterAPIController().start();