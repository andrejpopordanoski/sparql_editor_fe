import { combineReducers } from 'redux';
import { REGISTER } from 'redux/constants/auth.constants';
import { basicReducer } from './basic.reducer';
// import { REGISTER } from '../constants/register.constants';

export default combineReducers({
    register: basicReducer(REGISTER),
});
