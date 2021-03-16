import { tokenHelper } from 'services/tokenHelpers';
import { refreshProviderToken } from 'redux/actions/auth.actions';
import { LOGIN, STORAGE_PERSIST } from 'redux/constants/auth.constants';

function onlyOnce() {
    var executed = false;
    return function(buffer, next) {
        if (executed === true) {
            return;
        }
        executed = true;
        buffer.forEach(action => {
            return next(action);
        });
    };
}

let func = onlyOnce();
let buffer = [];

export default function tokenMiddleware({ dispatch, getState }) {
    return next => async action => {
        if (
            (action.type && action.type.includes('persist')) ||
            (action.type && action.type.includes(LOGIN.entity)) ||
            (action.type && action.type.includes(STORAGE_PERSIST.entity))
        ) {
            return next(action);
        }

        let store = getState();

        if (tokenHelper.isAccessTokenExpired && !store.auth.data.fetchingToken) {
            refreshProviderToken(dispatch).then(() => {
                return next(action);
            });
        } else if (tokenHelper.isAccessTokenExpired && store.auth.data.fetchingToken) {
            buffer.push(action);

            store.auth.data.fetchingToken.then(() => {
                func(buffer, next);
            });
        } else {
            return next(action);
        }
    };
}
