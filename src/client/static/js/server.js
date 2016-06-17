'use strict';

import React from 'react'
import {renderToString} from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import createHistory from 'history/lib/createMemoryHistory'
import creatRoutes from './routes'
import configureStore from './store/configureStore'


const render = function(stateData, ctx) {
	const history = createHistory();
	const routes = creatRoutes(history);
	const location = history.createLocation(ctx.originalUrl);
	return new Promise((resolve, reject) =>{
		try{
			match({routes, location}, (err, redirect, props) => {
				const store = configureStore(stateData);
				const state = store.getState();
				let html = '';
				try{
					html += renderToString(
						<Provider store={store} key="provider">
							<RouterContext {...props}/>
						</Provider>
					);
				} catch(err) {
					console.log('render error:' + err)
				}
				console.log(html)
				if (err) {
					reject('server render error');
				} else {
					resolve({html, state});
				}
			});
		}catch(err){
			console.log(err)
		}
	});
	
}

exports.default = global.renderReact = render;
