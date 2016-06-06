import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory ,applyRouterMiddleware} from 'react-router';
import useScroll from 'react-router-scroll';
import configureStore from './store/configureStore'
import routes from './routes'


const initialState = window.__INITIAL_DATA__
const store = configureStore(initialState)
const rootElement = document.getElementById('app')

const component = (
	<Router history= {browserHistory}  render={applyRouterMiddleware(useScroll())}> 
		{routes}
	</Router>
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  rootElement
)
