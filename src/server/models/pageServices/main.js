'use strict';
module.exports = function (mvc) {
	let main = mvc.pageService.create("main");

	main.getRenderData = function *(ctx, params){

		return {counter:1000};
	}
}