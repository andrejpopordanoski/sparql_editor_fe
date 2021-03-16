import { LOGIN, STORAGE_PERSIST } from 'redux/constants/auth.constants';
import { ActionStatus } from 'redux/core/ActionStatus';
import { persistor } from 'redux/config/store';
import {
  loginApiRequest,
  refreshTokenRequest,
} from 'services/apiRequests/login';
import { buildActionType } from 'redux/actions/buildActionType';
import {
  REGISTER,
  REGISTER_PROGRESS,
  FIRST_STEP_DATA,
  SECOND_STEP_DATA,
} from '../constants/register.constants';
import { useSelector } from 'react-redux';
import requestAgent from '../../services/requestAgent';
import { REGISTER_API } from '../../services/api';
import { LOGOUT } from '../constants/auth.constants';
import { PostRequestWithData } from '../../services/apiRequests';

const passwordLoginAction = (email, password) => async (dispatch) => {
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

const refreshProviderToken = async (dispatch) => {
  let tokenPromise = refreshTokenRequest().then((response) => {
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

export { passwordLoginAction, refreshProviderToken };
