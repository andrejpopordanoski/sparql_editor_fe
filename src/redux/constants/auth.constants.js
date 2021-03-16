import { Action } from 'redux/core/Action';

export const LOGIN = { entity: 'LOGIN', action: Action.HANDLE };
export const STORAGE_PERSIST = { entity: 'STORAGE', action: Action.UPDATE };
export const LOGOUT = { entity: 'PROVIDER_OUT', action: Action.LOGOUT };
export const NOT_AUTHORIZED = { entity: 'NOT_AUTHORIZED', action: Action.LOGOUT };
