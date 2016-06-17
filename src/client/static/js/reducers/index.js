import { combineReducers } from 'redux'
import counter from './Counter'
import {routerReducer as routing} from 'react-router-redux';


const rootReducer = combineReducers({
  counter,
  routing
})

export default rootReducer
