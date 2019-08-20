import { BIND_USER_INFO, CHANGE_LANGUAGE_LOCAL, LOGOUT } from "../actions";

export default function(state = {}, action) {
    switch (action.type) {
        case BIND_USER_INFO: {
            return action.payload.data;
        }
        case CHANGE_LANGUAGE_LOCAL: {
            state.auth = { ...state.auth, language: action.payload.language };
            return { ...state };
        }
        case LOGOUT: {
            return {};
        }

        default:
            return state;
    }
}
