import { ActionStatus } from 'redux/core/ActionStatus';
import { buildActionType } from 'redux/actions/buildActionType';
import { StateStatus } from 'redux/core/StateStatus';

const initialState = {
    auth: '',
    data: {},
};

const basicReducer = actionType => (state = initialState, action) => {
    switch (action.type) {
        case buildActionType(actionType, ActionStatus.START):
            return {
                ...initialState,
                status: StateStatus.LOADING,
                version: state.version,
                entity: actionType.entity,
            };

        case buildActionType(actionType, ActionStatus.DONE):
            return {
                status: StateStatus.LOADED,
                data: action.payload,
                entity: actionType.entity,
                version: +new Date(),
            };

        case buildActionType(actionType, ActionStatus.FAILED):
            return {
                status: StateStatus.ERROR,
                errors: action.payload,
            };

        case buildActionType(actionType, ActionStatus.RESET):
            return initialState;

        default:
            return state;
    }
};

export { basicReducer };
