import { ActionStatus } from 'redux/core/ActionStatus';
import { buildActionType } from 'redux/actions/buildActionType';
import { LOGOUT, NOT_AUTHORIZED, LOGIN, STORAGE_PERSIST } from 'redux/constants/auth.constants';
import { StateStatus } from 'redux/core/StateStatus';

const auth = (
    state = {
        data: {},
        status: StateStatus.NOT_INITIALIZED,
        error: null,
        persisted: false,
    },
    action
) => {
    switch (action.type) {
        case buildActionType(LOGIN, ActionStatus.START):
            return { status: StateStatus.LOADING, data: {}, error: null, persisted: false };

        case buildActionType(LOGIN, ActionStatus.REFRESH):
            return { ...state, data: { ...action.payload }, persisted: false, status: StateStatus.REFRESHING };

        case buildActionType(LOGIN, ActionStatus.DONE):
            return { status: StateStatus.LOADED, data: { ...action.payload }, persisted: false, error: null, version: +new Date() };

        case buildActionType(STORAGE_PERSIST, ActionStatus.DONE):
            return { ...state, persisted: true, version: +new Date() };

        case buildActionType(LOGIN, ActionStatus.FAILED):
            return { status: StateStatus.ERROR, error: action.payload };
        case LOGOUT:
            state = null;
            return { status: StateStatus.NOT_INITIALIZED, data: null, error: null, persisted: false };
        case NOT_AUTHORIZED:
            state = null;
            return { status: StateStatus.NOT_INITIALIZED, data: null, error: NOT_AUTHORIZED, persisted: false };
        default:
            return state;
    }
};

export { auth };
