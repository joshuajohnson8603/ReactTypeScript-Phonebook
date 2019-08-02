
import { Reducer, combineReducers } from 'redux';
import {IAppState} from './Model';
import {PhoneBookListReducer} from '../phonebooklist';
import {routerReducer} from 'react-router-redux';

export const rootReducer: Reducer<IAppState> = combineReducers<IAppState>({
  PhoneBookList: PhoneBookListReducer,
  routing: routerReducer,
});
