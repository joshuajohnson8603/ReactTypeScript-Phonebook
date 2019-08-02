
import { IPhoneBookList, IPhoneBook } from './Model';
import * as _ from 'lodash';

//
// Persist
//

export const PERSIST_KEY = 'state';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(PERSIST_KEY);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(PERSIST_KEY, serializedState);
  } catch (err) {
    // Ignore write failure
  }
};

//
// Sorting functions
//

export const sortByStringAscending = (array, condition)  => array.sort((a, b) => a[condition].localeCompare(b[condition]));
export const sortByStringDescending = (array, condition)  => array.sort((a, b) => b[condition].localeCompare(a[condition]));
