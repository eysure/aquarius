import { LOGIN, LOGOUT, SERVER_LOGOUT, CLOSE_MSG, CLEAR_MSG } from "../actions";
import uuidv4 from "uuid/v4";
import _ from "lodash";

export default function(state = [], action) {
    switch (action.type) {
        case CLOSE_MSG: {
            for (var oldMsg of state) {
                if (oldMsg.key === action.payload.key) oldMsg.new = false;
            }
            return [...state];
        }
        case LOGIN:
        case LOGOUT: {
            if (action.payload.data.noMsg) return state;
            let msg = detectMessage(action);
            if (msg) return [msg];
        }
        case CLEAR_MSG: {
            return [];
        }
        default:
            break;
    }

    let msg = detectMessage(action);
    if (msg) {
        return updateState(msg, state);
    }

    return state;
}

const detectMessage = action => {
    let msg = _.get(action, "payload.data.msg", null);
    if (msg) {
        msg.new = true;
        msg.time = Date.now();
        msg.key = msg.key || uuidv4();
    }
    return msg;
};

const updateState = (msg, state) => {
    let newMsg = msg;
    for (let i = 0; i < state.length; i++) {
        if (state[i].key === msg.key) {
            state[i] = msg;
            newMsg = null;
            break;
        }
    }
    if (newMsg) return [newMsg, ...state];
    else return [...state];
};
