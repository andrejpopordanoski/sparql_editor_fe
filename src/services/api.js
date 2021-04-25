export const LOGIN_API = `/oauth/token`;
export const REGISTER_API = `/api/users/register`;
export const QUERY_API = '/sparql';
// export const QUERY_API = (url, graphNameIri, sparqlQueryVal, format, timeOutVal) =>
// `/sparql?url=${url}&defaultGraphSetIri=${graphNameIri}&queryStr=${encodeURI(sparqlQueryVal)}&format=${format}&timeout=${timeOutVal}`;
export const SAVE_QUERY_API = `/api/users/save_query`;
export const GET_ALL_QUERIES_BY_USER_API = page => '/api/users/get_all_queries?size=10&page=' + page;
export const GET_SAVED_QUERY_RESULT_API = '/api/users/qet_query_result';
export const GET_SINGLE_PUBLIC_QUERY_API = queryId => '/api/users/get_single_public_query?queryId=' + queryId;
export const GET_ALL_PUBLIC_QUERIES_API = page => '/api/users/get_all_public_queries?size=10&page=' + page;
