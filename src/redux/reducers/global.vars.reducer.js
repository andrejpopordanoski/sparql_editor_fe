import { FETCH_CALENDAR } from 'redux/constants/vars.constants';

const globalVars = (
    state = {
        data: {
            fetchCalendar: true,
        },
    },
    action
) => {
    switch (action.type) {
        case FETCH_CALENDAR:
            return { ...state, data: { ...state.data, fetchCalendar: action.payload } };

        default:
            return state;
    }
};

export { globalVars };
