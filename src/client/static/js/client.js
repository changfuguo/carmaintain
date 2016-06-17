//import 'babel-polyfill'   //这里先去掉这个，有babel-transform-runtime用来做转换的
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory ,applyRouterMiddleware} from 'react-router';
import configureStore from './store/configureStore'
import routes from './routes'
const initialState = window.__INITIAL_DATA__
const store = configureStore(initialState)
const rootElement = document.getElementById('app')
global.__SERVER__ = false ;


let render = () => {
	ReactDOM.render(
  		<Provider store={store} key="provider">
    		{routes}
  		</Provider>,
  		rootElement
	)
};

if(module.hot) {
	let renderNormally = render;
	const renderException = (error) => {
		const RedBox = require('redbox-react');
		console.log(require('redbox-react'))
    	ReactDOM.render(<RedBox error={error}/>, rootElement);
	};

	render = () => {
		try{
			renderNormally();
		} catch(e) {
			renderException(e);
		}
	};
  	module.hot.accept('./routes', () => {
  		render();
  	});
}

render();
