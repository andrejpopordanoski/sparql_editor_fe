import { ActionStatus } from 'redux/core/ActionStatus';
import { QUERY_API } from 'services/api';
import { PostRequestWithData } from 'services/apiRequests';
import { EXAMPLE_ACTION, EXECUTE_QUERY } from '../constants/main.constants';
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
