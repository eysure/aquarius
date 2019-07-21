import { BIND_AUTH, LOGOUT } from "../actions";

export default function(state = {}, action) {
    switch (action.type) {
        case BIND_AUTH: {
            state = action.payload.auth;
            return { ...state };
        }
        case LOGOUT: {
            return {};
        }
        default:
            return state;
    }
}
