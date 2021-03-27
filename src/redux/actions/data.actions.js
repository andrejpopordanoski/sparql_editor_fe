import { ActionStatus } from 'redux/core/ActionStatus';
import { QUERY_API, SAVE_QUERY_API } from 'services/api';
import { PostRequestWithData } from 'services/apiRequests';
import { EXAMPLE_ACTION, EXECUTE_QUERY, SAVE_QUERY } from '../constants/main.constants';
import { buildActionType } from './buildActionType';

export const processQuery = (url, query) => async dispatch => {
    let data = new FormData();
    data.set('url', url);
    data.set('queryStr', query);

    dispatch({
        type: buildActionType(EXECUTE_QUERY, ActionStatus.START),
    });

    const response = await PostRequestWithData(QUERY_API, data);

    if (response.success) {
        dispatch({
            type: buildActionType(EXECUTE_QUERY, ActionStatus.DONE),
            payload: {
                ...response,
            },
        });
    }
};

export const saveQueryAction = (url, defaultGraphSetIri, queryStr, format, timeout, queryNameVal) => async dispatch => {
    let data = new FormData();
    data.set('url', url);
    data.set('defaultGraphSetIri', defaultGraphSetIri);
    data.set('queryStr', queryStr);

    data.set('format', format);
    data.set('timeout', timeout);
    data.set('queryName', queryNameVal);

    dispatch({
        type: buildActionType(SAVE_QUERY, ActionStatus.START),
    });

    const response = await PostRequestWithData(SAVE_QUERY_API, data);

    if (response.success) {
        dispatch({
            type: buildActionType(SAVE_QUERY, ActionStatus.DONE),
            payload: {
                ...response,
            },
        });
    }
};
