'use strict';

import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'

import routes from './routes'
import configureStore from './store/configureStore'
 
const render = function(stateData, ctx) {

	return new Promise((resolve, reject) =>{

		match({ routes: routes, location: ctx.url }, (err, redirect, props) => {
			const store = configureStore(stateData);
			const html = renderToString(
				renderToString(<RouterContext {...props}/>)
			);
			
			const state = store.getState();

			if (err) {
				reject('server render error');
			} else {
				resolve({html,state});
			}
		});
	});
	
}

exports.default = global.renderReact = render;
