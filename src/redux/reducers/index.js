import { combineReducers } from 'redux';
import { EXECUTE_QUERY, EXECUTE_QUERY_HTML, GET_ALL_QUERIES, GET_SAVED_QUERY_RESULT } from 'redux/constants/main.constants';

import { buildActionType } from '../actions/buildActionType';
import { LOGOUT } from '../constants/auth.constants';
import { ActionStatus } from '../core/ActionStatus';
import { auth } from './auth';
import { basicReducer } from './basic.reducer';
import registerReducer from './register.reducer';

const rootReducer = combineReducers({
    auth: auth,
    register: registerReducer,
    query: basicReducer(EXECUTE_QUERY),
    queryHTML: basicReducer(EXECUTE_QUERY_HTML),
    allQueries: basicReducer(GET_ALL_QUERIES),
    savedQueryResult: basicReducer(GET_SAVED_QUERY_RESULT),
});

export default (state, action) => rootReducer(action.type === buildActionType(LOGOUT, ActionStatus.DONE) ? undefined : state, action);
