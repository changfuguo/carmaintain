'use strict';

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'
import App from './containers/App'

//hhfffffffdddff
let status = 5;
const render = function(path, stateData, ctx){

	const store = configureStore(stateData);
	const html = renderToString(
		<Provider store = {store}>
			<App/>
		</Provider>
	);
	
	const state = store.getState();

	return {html, state};
}

exports.default = global.renderReact = render;
