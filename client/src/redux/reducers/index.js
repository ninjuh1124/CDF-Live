import { combineReducers } from 'redux';
import feed from './feed';
import reddit from './reddit';

export default combineReducers({ feed, reddit });
