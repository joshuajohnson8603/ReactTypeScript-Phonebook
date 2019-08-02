import {IPhoneBookList} from '../phonebooklist';
import {RouterState} from 'react-router-redux';

export interface IAppState {
    PhoneBookList: IPhoneBookList;
    routing: RouterState;
}
