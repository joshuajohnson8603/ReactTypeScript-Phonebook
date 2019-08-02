
import { Reducer, combineReducers } from 'redux';
import {IAppState} from './Model';
import {routerReducer} from 'react-router-redux';

export const rootReducer: Reducer<IAppState> = combineReducers<IAppState>({
  routing: routerReducer,
});
