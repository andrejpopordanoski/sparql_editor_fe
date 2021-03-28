import { ActionStatus } from 'redux/core/ActionStatus';
import { GET_ALL_QUERIES_BY_USER_API, QUERY_API, SAVE_QUERY_API } from 'services/api';
import { PlainApiRequest, PostRequestWithData } from 'services/apiRequests';
import { EXAMPLE_ACTION, EXECUTE_QUERY_HTML, EXECUTE_QUERY, SAVE_QUERY, GET_ALL_QUERIES } from '../constants/main.constants';
import { buildActionType } from './buildActionType';

export const processQuery = (url, graphNameIri, sparqlQueryVal, format, timeOutVal) => async dispatch => {
    let data = new FormData();
    data.set('url', url);
    data.set('defaultGraphSetIri', graphNameIri);
    data.set('queryStr', sparqlQueryVal);

    data.set('format', format);
    data.set('timeout', timeOutVal);

    console.log(url, graphNameIri, sparqlQueryVal, format, timeOutVal);

    dispatch({
        type: buildActionType(EXECUTE_QUERY, ActionStatus.START),
    });

    // const response = await PlainApiRequest(QUERY_API(url, graphNameIri, sparqlQueryVal, format, timeOutVal));
    // const response = await PlainApiRequest(QUERY_API);
    const response = await PostRequestWithData(QUERY_API, data);

    if (response.success) {
        dispatch({
            type: buildActionType(EXECUTE_QUERY, ActionStatus.DONE),
            payload: {
                data: response.data,
            },
        });
    }
};

export const processQueryHTML = (url, graphNameIri, sparqlQueryVal, timeOutVal) => async dispatch => {
    let data = new FormData();
    data.set('url', url);
    data.set('defaultGraphSetIri', graphNameIri);
    data.set('queryStr', sparqlQueryVal);
    data.set('format', 'text/html');

    data.set('timeout', timeOutVal);
    data.set('forHtml', true);

    dispatch({
        type: buildActionType(EXECUTE_QUERY_HTML, ActionStatus.START),
    });

    // const response = await PlainApiRequest(QUERY_API(url, graphNameIri, sparqlQueryVal, 'text/html', timeOutVal));
    const response = await PostRequestWithData(QUERY_API, data);

    if (response.success) {
        dispatch({
            type: buildActionType(EXECUTE_QUERY_HTML, ActionStatus.DONE),
            payload: {
                data: response.data,
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

export const getAllQueriesAction = () => async dispatch => {
    dispatch({
        type: buildActionType(GET_ALL_QUERIES, ActionStatus.START),
    });

    const response = await PlainApiRequest(GET_ALL_QUERIES_BY_USER_API);

    if (response.success) {
        dispatch({
            type: buildActionType(GET_ALL_QUERIES, ActionStatus.DONE),
            payload: {
                ...response,
            },
        });
    }
};
