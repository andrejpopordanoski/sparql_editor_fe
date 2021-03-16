import axios from 'axios';
// require('dotenv').config();

const API_ENDPOINT = 'http://localhost:8080';
// const API_ENDPOINT = process.env.REACT_APP_FITNESS_API_ENDPOINT;
// const API_ENDPOINT = 'http://132.148.128.106:3000';

let requestsLog = [];

const perform = (method, url, data, headers, auth) => {
    const performFunc = () => {
        return axios({
            method: method,
            url: url,
            data: data,
            headers: headers
                ? {
                      ...headers,
                      'Content-Type': headers['Content-Type'] || 'application/json',
                  }
                : {},
        });
    };

    return performFunc()
        .then(res => {
            requestsLog.push({
                date: new Date().toUTCString(),
                urlRequested: url,
                requestType: method,
                requestData: data,
                wasSuccessful: true,
            });
            return res;
        })
        .catch(e => {
            requestsLog.push({
                date: new Date().toUTCString(),
                urlRequested: url,
                requestType: method,
                requestData: data,
                wasSuccessful: false,
                error: e,
            });
            throw e;
        });
};

export default {
    get: (path, headers) => {
        console.log('=====GET REQUEST FROM=======' + API_ENDPOINT + path);
        return perform('GET', API_ENDPOINT + path, {}, headers || {}, {});
    },
    post: (path, data, headers, auth) => perform('POST', API_ENDPOINT + path, data, headers || {}, auth || {}),
    getLog: () => requestsLog,
    // Not auth implemented
    useUrl: url => {
        return {
            get: () => perform('GET', url),
            post: (data, additional) => perform('POST', url, data, additional.headers),
        };
    },
};
