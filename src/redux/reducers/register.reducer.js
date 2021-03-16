import { combineReducers } from 'redux';
import { basicReducer } from './basic.reducer';
import { REGISTER, REGISTER_PROGRESS, FIRST_STEP_DATA, SECOND_STEP_DATA } from '../constants/register.constants';

export default combineReducers({
    status: basicReducer(REGISTER),
    progress: basicReducer(REGISTER_PROGRESS),
    firstStepData: basicReducer(FIRST_STEP_DATA),
    secondStepData: basicReducer(SECOND_STEP_DATA),
});
