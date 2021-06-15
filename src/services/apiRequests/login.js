import requestAgent from 'services/requestAgent';
import { handleSuccess, handleError } from './utils';
import { LOGIN_API } from 'services/api';
import { tokenHelper } from 'services/tokenHelpers';

export const loginApiRequest = async (email, password) => {
    let data = new FormData();
    data.append('username', email);
    data.append('password', password);
    try {
        const responseData = await requestAgent.post(LOGIN_API + '?grant_type=password', data, {
            Authorization: 'Basic ' + btoa('ClientId:secret'),
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        return handleSuccess(responseData);
    } catch (e) {
        return handleError();
    }
};

export const registerApiRequest = async (api, user, headers) => {
    try {
        const responseData = await requestAgent.post(api, user, headers);

        return handleSuccess(responseData);
    } catch (e) {
        return handleError();
    }
};

export const refreshTokenRequest = async () => {
    let data = new FormData();
    let refreshToken = tokenHelper.refreshToken;
    if (refreshToken) {
        data.append('refresh_token', refreshToken);

        const responseData = await requestAgent.post(LOGIN_API + '?grant_type=refresh_token', data, {
            Authorization: 'Basic ' + btoa('ClientId:secret'),
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        if (responseData.status === 200) {
            return handleSuccess(responseData);
        }
    }
    return handleError();
};
