import { ActionStatus } from 'redux/core/ActionStatus';
import {
    GET_ALL_PUBLIC_QUERIES_API,
    GET_ALL_QUERIES_BY_USER_API,
    GET_SAVED_QUERY_RESULT_API,
    QUERY_API,
    SAVE_QUERY_API,
    GET_SINGLE_PUBLIC_QUERY_API,
    DELETE_QUERY_API,
} from 'services/api';
import { PlainApiRequest, PostRequestWithData } from 'services/apiRequests';
import {
    EXAMPLE_ACTION,
    EXECUTE_QUERY_HTML,
    EXECUTE_QUERY,
    SAVE_QUERY,
    GET_ALL_QUERIES,
    GET_SAVED_QUERY_RESULT,
    GET_ALL_QUERIES_PUBLIC,
    GET_SINGLE_PUBLIC_QUERY,
    DELETE_QUERY,
} from '../constants/main.constants';
import { buildActionType } from './buildActionType';

export const processQuery = (url, graphNameIri, sparqlQueryVal, format, timeOutVal, queryType) => async dispatch => {
    let data = new FormData();
    data.set('url', url);
    data.set('defaultGraphSetIri', graphNameIri);
    data.set('queryStr', sparqlQueryVal);

    data.set('format', format);
    data.set('timeout', timeOutVal);
    data.set('queryType', queryType);

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

export const processQueryHTML = (url, graphNameIri, sparqlQueryVal, timeOutVal, queryType) => async dispatch => {
    let data = new FormData();
    data.set('url', url);
    data.set('defaultGraphSetIri', graphNameIri);
    data.set('queryStr', sparqlQueryVal);
    data.set('format', 'application/json');

    data.set('timeout', timeOutVal);
    data.set('forHtml', true);
    data.set('queryType', queryType);

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

export const saveQueryAction = (
    url,
    defaultGraphSetIri,
    queryStr,
    format,
    timeout,
    queryNameVal,
    privateModifierCheckBoxVal,
    queryType
) => async dispatch => {
    let data = new FormData();
    data.set('url', url);
    data.set('defaultGraphSetIri', defaultGraphSetIri);
    data.set('queryStr', queryStr);

    data.set('format', format);
    data.set('timeout', timeout);
    data.set('queryName', queryNameVal);
    data.set('privateAccess', privateModifierCheckBoxVal);
    data.set('queryType', queryType);

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
        // dispatch(getAllQueriesAction());
    }
};

export const getAllQueriesAction = page => async dispatch => {
    dispatch({
        type: buildActionType(GET_ALL_QUERIES, ActionStatus.START),
    });

    const response = await PlainApiRequest(GET_ALL_QUERIES_BY_USER_API(page));

    if (response.success) {
        dispatch({
            type: buildActionType(GET_ALL_QUERIES, ActionStatus.DONE),
            payload: {
                ...response,
            },
        });
    }
};

export const getAllPublicQueriesAction = page => async dispatch => {
    dispatch({
        type: buildActionType(GET_ALL_QUERIES_PUBLIC, ActionStatus.START),
    });

    const response = await PlainApiRequest(GET_ALL_PUBLIC_QUERIES_API(page));

    if (response.success) {
        dispatch({
            type: buildActionType(GET_ALL_QUERIES_PUBLIC, ActionStatus.DONE),
            payload: {
                ...response,
            },
        });
    }
};
export const getSinglePublicQueryAction = queryId => async dispatch => {
    dispatch({
        type: buildActionType(GET_SINGLE_PUBLIC_QUERY, ActionStatus.START),
    });

    const response = await PlainApiRequest(GET_SINGLE_PUBLIC_QUERY_API(queryId));

    if (response.success) {
        dispatch({
            type: buildActionType(GET_SINGLE_PUBLIC_QUERY, ActionStatus.DONE),
            payload: {
                ...response,
            },
        });
    }
};

export const deleteQueryAction = queryId => async dispatch => {
    dispatch({
        type: buildActionType(DELETE_QUERY, ActionStatus.START),
    });

    const response = await PostRequestWithData(DELETE_QUERY_API(queryId));

    if (response.success) {
        dispatch({
            type: buildActionType(DELETE_QUERY, ActionStatus.DONE),
            payload: {
                ...response,
            },
        });
    }
};

// GET_SAVED_QUERY_RESULT_API

export const getSavedQueryResultAction = (format, queryId) => async dispatch => {
    let data = new FormData();
    data.set('format', format);
    data.set('queryId', queryId);

    dispatch({
        type: buildActionType(GET_SAVED_QUERY_RESULT, ActionStatus.START),
    });

    // const response = await PlainApiRequest(QUERY_API(url, graphNameIri, sparqlQueryVal, format, timeOutVal));
    // const response = await PlainApiRequest(QUERY_API);
    const response = await PostRequestWithData(GET_SAVED_QUERY_RESULT_API, data);

    if (response.success) {
        dispatch({
            type: buildActionType(GET_SAVED_QUERY_RESULT, ActionStatus.DONE),
            payload: {
                data: response.data,
            },
        });
    }
};
