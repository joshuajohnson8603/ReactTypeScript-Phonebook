
import { IPhoneBookList, IPhoneBook } from './Model';
import * as _ from 'lodash';

//
// ActionConstants
//
export type PhoneBookListAddItem = 'PhoneBooklist/PhoneBookListAddItem';
export const PhoneBookListAddItem: PhoneBookListAddItem = 'PhoneBooklist/PhoneBookListAddItem';

export type PhoneBookListRemoveItem = 'PhoneBooklist/PhoneBookListRemoveItem';
export const PhoneBookListRemoveItem: PhoneBookListRemoveItem = 'PhoneBooklist/PhoneBookListRemoveItem';

export interface IPhoneBookListActionAddItem {
  type: PhoneBookListAddItem;
}
export interface IPhoneBookListActionRemoveItem {
  type: PhoneBookListRemoveItem;
  id: number;
}

export type PhoneBookListAction = IPhoneBookListActionAddItem | IPhoneBookListActionRemoveItem;


export type PhoneBookEdit = 'PhoneBooklist/PhoneBookEdit';
export const PhoneBookEdit: PhoneBookEdit = 'PhoneBooklist/PhoneBookEdit';

export interface IPhoneBookActionEdit {
  type: PhoneBookEdit;
  id: number;
  newFirstName: string;
  newLastName: string;
  newBirthday: string;
  newPhoneNumber: string;
}

export type PhoneBookAction = IPhoneBookActionEdit;


// 
// Persist
//

export const PERSIST_KEY = 'state'
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(PERSIST_KEY)
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(PERSIST_KEY, serializedState)
  } catch (err) {
    // Ignore write failure
  }
}

// 
// Sorting functions
//

export const sortByStringAscending = (array, condition)  => array.sort((a, b) => a[condition].localeCompare(b[condition]));
export const sortByStringDescending = (array, condition)  => array.sort((a, b) => b[condition].localeCompare(a[condition]));

//
// Action creators
//

export function addPhoneBook():IPhoneBookListActionAddItem {
  return {type: PhoneBookListAddItem};
}

export function removePhoneBook(id:number):IPhoneBookListActionRemoveItem {
  return {type: PhoneBookListRemoveItem, id: id};
}

export function changePhoneBook(id: number, newFirstName: string, newLastName: string, newBirthday: string, newPhoneNumber: string):IPhoneBookActionEdit {
  return {type: PhoneBookEdit, id: id, newFirstName: newFirstName, newLastName: newLastName, newBirthday: newBirthday, newPhoneNumber: newPhoneNumber };
}


//
// Reducers
//

const initialPhoneBookListState: IPhoneBookList = {
  items: [],
};

const initialPhoneBookState: IPhoneBook = {
  id: 0,
  first_name: '',
  last_name: '',
  birthday: '',
  phonenumber: '',
};

function createNewItem( state: IPhoneBook[] ):IPhoneBook {
  const id = state.length > 0 ? Math.max(...state.map(i => i.id)) + 1 : 0;
  const item = { ... initialPhoneBookState, id: id, first_name: '', last_name: '', birthday: '', phonenumber: '' };
  return item;
}

// Nested PhoneBook reducers
export function PhoneBookReducers(state: IPhoneBook = initialPhoneBookState, action: PhoneBookAction): IPhoneBook {
  switch (action.type) {
    case PhoneBookEdit:
      return { ...state, first_name: action.newFirstName, last_name: action.newLastName, birthday: action.newBirthday, phonenumber: action.newPhoneNumber };
    default:
      return state;
  }
}

// Nested PhoneBook list items reducers
function PhoneBookListItemsReducer(state: IPhoneBook[], action: PhoneBookListAction | PhoneBookAction): IPhoneBook[] {
  switch (action.type) {
    case PhoneBookListAddItem:
      return [ ...state, createNewItem(state) ];
    case PhoneBookListRemoveItem:
      return _.remove(state, (item) => item.id !== action.id);
    case PhoneBookEdit:
      return state.map( item => item.id === action.id ? PhoneBookReducers(item, action) : item );
    default:
      return state;
  }
}

// main PhoneBooklist state reducer to be combined to root
export default function reducer(state: IPhoneBookList = initialPhoneBookListState, action: PhoneBookListAction | PhoneBookAction): IPhoneBookList {
  const items = PhoneBookListItemsReducer(state.items, action);
  return {items: items };
}
