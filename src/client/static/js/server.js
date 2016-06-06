'use strict';

import React from 'react'
import {renderToString} from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import routes from './routes'
import configureStore from './store/configureStore'
 
const render = function(stateData, ctx) {

	return new Promise((resolve, reject) =>{

		try{
			match({routes, location: ctx.url }, (err, redirect, props) => {
				const store = configureStore(stateData);
				const state = store.getState();
				let html = '<!-- default -->';
				console.log(props)
				try{
					html = renderToString(
						<Provider store={store} key="provider">
							<RouterContext {...props}/>
						</Provider>
					)
					console.log(`html: ${html}`)
				} catch(err) {
					console.log(err)
				}

				if (err) {
					reject('server render error');
				} else {
					resolve({html,state});
				}
			});
		}catch(err){
			console.log(err)
		}
	});
	
}

exports.default = global.renderReact = render;
