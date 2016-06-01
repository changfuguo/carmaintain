'use strict';
import 'babel-polyfill'


import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'
import App from './containers/App'



const render = function(path, stateData, ctx){

	const store = configureStore(preloadedState);

	const html = renderToString(
		<Provider store = {store}>
			<App/>
		</Provider>
	);

	const state = store.getState();

	return {html, state};
}

exports.default = global.renderReact = render;