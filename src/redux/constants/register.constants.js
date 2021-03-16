import { Action } from 'redux/core/Action';

export const REGISTER = { entity: 'REGISTER', action: Action.HANDLE };
export const REGISTER_PROGRESS = { entity: 'REGISTER_PROGRESS', action: Action.UPDATE };
export const FIRST_STEP_DATA = { entity: 'REGISTER_FIRST_STEP_DATA', action: Action.UPDATE };
export const SECOND_STEP_DATA = { entity: 'REGISTER_SECOND_STEP_DATA', action: Action.UPDATE };
