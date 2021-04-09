export const LOGIN_API = `/oauth/token`;
export const REGISTER_API = `/api/users/register`;
export const QUERY_API = '/sparql';
// export const QUERY_API = (url, graphNameIri, sparqlQueryVal, format, timeOutVal) =>
// `/sparql?url=${url}&defaultGraphSetIri=${graphNameIri}&queryStr=${encodeURI(sparqlQueryVal)}&format=${format}&timeout=${timeOutVal}`;
export const SAVE_QUERY_API = `/api/users/save_query`;
export const GET_ALL_QUERIES_BY_USER_API = '/api/users/get_all_queries';
export const GET_SAVED_QUERY_RESULT_API = '/api/users/qet_query_result';
