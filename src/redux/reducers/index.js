import { combineReducers } from 'redux';
import { EXECUTE_QUERY } from 'redux/constants/main.constants';

import { buildActionType } from '../actions/buildActionType';
import { LOGOUT } from '../constants/auth.constants';
import { ActionStatus } from '../core/ActionStatus';
import { basicReducer } from './basic.reducer';

const rootReducer = combineReducers({
    query: basicReducer(EXECUTE_QUERY),
});

export default (state, action) => rootReducer(action.type === buildActionType(LOGOUT, ActionStatus.DONE) ? undefined : state, action);
