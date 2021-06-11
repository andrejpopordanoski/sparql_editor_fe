import requestAgent from 'services/requestAgent';
import { handleSuccess, handleError } from './utils';
import { tokenHelper } from 'services/tokenHelpers';
// export default function getAccessToken() {
//     let persist = localStorage.getItem('persist:coach');
//     if (persist) {

//         return JSON.parse(JSON.parse(persist).auth).data.response.data.access_token;
//     } else {
//         return false;
//     }
// }

export const PlainApiRequest = async API => {
    let auth = tokenHelper.auth();
    // const responseData = await requestAgent.get(API, {
    //     Authorization: 'Bearer ' + auth,
    // });

    // if (responseData.status === 200) {
    //     return handleSuccess(responseData);
    // } else {
    //     return handleError(responseData.status, API, this);
    // }
    let error = null;
    const responseData = await requestAgent
        .get(API, {
            Authorization: 'Bearer ' + auth,
        })
        .catch(err => {
            error = err;
        });
    if (error) {
        return handleError(error);
    }
    if (responseData) {
        if (responseData.status === 200) {
            return handleSuccess(responseData);
        }
    }
};

export const PostRequestWithData = async (API, data, headers) => {
    let auth = tokenHelper.auth();

    let error = null;
    const responseData = await requestAgent
        .post(
            API,
            data,
            headers
                ? {
                      ...headers,
                      Authorization: 'Bearer ' + auth,
                  }
                : {
                      Authorization: 'Bearer ' + auth,
                  }
        )
        .catch(err => {
            error = err;
        });
    if (error) {
        return handleError(error);
    }
    if (responseData.status === 200) {
        return handleSuccess(responseData);
    }
};
