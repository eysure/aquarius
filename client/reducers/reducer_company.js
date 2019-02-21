import * as Action from "../actions";

export default function(state = {}, action) {
    switch (action.type) {
        case Action.BIND_EMPLOYEES_INFO: {
            return { ...state, employees: action.payload.data };
        }
        case Action.SERVER_LOGOUT:
        case Action.LOGOUT: {
            return {};
        }
        default:
            return state;
    }
}
