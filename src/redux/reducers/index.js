import { combineReducers } from 'redux';
import {
    DELETE_QUERY,
    EXECUTE_QUERY,
    EXECUTE_QUERY_HTML,
    GET_ALL_QUERIES,
    GET_ALL_QUERIES_PUBLIC,
    GET_SAVED_QUERY_RESULT,
    GET_SINGLE_PUBLIC_QUERY,
    SAVE_QUERY,
} from 'redux/constants/main.constants';

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
    allPublicQueries: basicReducer(GET_ALL_QUERIES_PUBLIC),
    savedQueryResult: basicReducer(GET_SAVED_QUERY_RESULT),
    savingQueryResponse: basicReducer(SAVE_QUERY),
    singlePublicQuery: basicReducer(GET_SINGLE_PUBLIC_QUERY),
    deleteQuery: basicReducer(DELETE_QUERY),
});

export default (state, action) => rootReducer(action.type === buildActionType(LOGOUT, ActionStatus.DONE) ? undefined : state, action);
