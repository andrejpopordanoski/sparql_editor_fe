import { LOGIN, LOGOUT, REGISTER, STORAGE_PERSIST } from 'redux/constants/auth.constants';
import { ActionStatus } from 'redux/core/ActionStatus';
import { persistor } from 'redux/config/store';
import { loginApiRequest, refreshTokenRequest } from 'services/apiRequests/login';
import { buildActionType } from 'redux/actions/buildActionType';
import requestAgent from 'services/requestAgent';
import { REGISTER_API } from 'services/api';
import userEvent from '@testing-library/user-event';

const passwordLoginAction = (email, password) => async dispatch => {
    dispatch({ type: buildActionType(LOGIN, ActionStatus.START) });
    const response = await loginApiRequest(email, password);

    if (response.success) {
        response.data.token_creatiron = Date.now();
        dispatch({
            type: buildActionType(LOGIN, ActionStatus.DONE),
            payload: {
                ...response,
            },
        });
        await persistor.flush();
        dispatch({ type: buildActionType(STORAGE_PERSIST, ActionStatus.DONE) });
    } else {
        dispatch({
            type: buildActionType(LOGIN, ActionStatus.FAILED),
            payload: {
                ...response,
            },
        });
    }
};

export const registerUserAction = (email, password, name, lastName) => async dispatch => {
    let user = {};
    user.email = email;
    user.password = password;
    user.name = name;
    user.lastName = lastName;

    // let formData = new FormData();
    // formData.append('userDTO', user);

    dispatch({
        type: buildActionType(REGISTER, ActionStatus.START),
    });

    const response = await requestAgent.post(REGISTER_API, user, { 'Content-Type': 'application/json' });

    if (response.status === 200) {
        dispatch({
            type: buildActionType(REGISTER, ActionStatus.DONE),
        });
    } else {
        dispatch({
            type: buildActionType(REGISTER, ActionStatus.FAILED),
        });
    }
};

const refreshProviderToken = async dispatch => {
    let tokenPromise = refreshTokenRequest().then(response => {
        response.data.token_creation = Date.now();
        dispatch({
            type: buildActionType(LOGIN, ActionStatus.DONE),
            payload: { ...response, fetchingToken: false },
        });
        persistor.flush();
        dispatch({ type: buildActionType(STORAGE_PERSIST, ActionStatus.DONE) });
        return Promise.resolve();
    });

    dispatch({
        type: buildActionType(LOGIN, ActionStatus.REFRESH),
        payload: {
            fetchingToken: tokenPromise,
        },
    });
    return tokenPromise;
    // try {
    //     const response = await refreshTokenRequest();
    //     if (response.success) {
    //         response.data.token_creation = Date.now();
    //         dispatch({ type: buildActionType(LOGIN, ActionStatus.DONE), payload: { ...response, fetchingToken: false } });
    //         await persistor.flush();
    //         dispatch({ type: buildActionType(STORAGE_PERSIST, ActionStatus.DONE) });
    //         return Promise.resolve(response.data.data.refresh_token);
    //     }
    // } catch (error) {
    //     return Promise.reject();
    // }
};

export const logoutAction = () => async dispatch => {
    dispatch({ type: buildActionType(LOGOUT, ActionStatus.DONE) });
    localStorage.removeItem('persist:tabs');
    localStorage.removeItem('persist:tabsLabels');
};

export { passwordLoginAction, refreshProviderToken };
