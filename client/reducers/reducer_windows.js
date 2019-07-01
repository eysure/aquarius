import * as ACTION from "../actions";
import _ from "lodash";

activateWindow = (state, appKey, windowKey) => {
    for (let a in state) {
        for (let w in state[a]) {
            state[a][w].handleActivate(false);
        }
    }
    if (!appKey) return;
    if (windowKey && state[appKey][windowKey]) state[appKey][windowKey].handleActivate(true);
    else if (!windowKey) {
        let windows = state[appKey];
        let windowCount = Object.keys(windows).length;
        if (windowCount === 0) console.warn("TODO: No window in a opened app, start the app again.");
        else windows[Object.keys(windows)[0]].handleActivate(true);
    } else if (windowKey && !state[appKey][windowKey]) console.error(`Attempt to activating an window not listed in the reducer: ${appKey}:${windowKey}`);
};

export default function(state = {}, action) {
    switch (action.type) {
        case ACTION.REGISTER_WINDOW: {
            let appKey = action.payload.appKey;
            let windowKey = action.payload.windowKey;
            let window = action.payload.window;
            if (!state[appKey]) state[appKey] = {};
            state[appKey][windowKey] = window;
            activateWindow(state, appKey, windowKey);
            return { ...state };
        }
        case ACTION.APP_WINDOW_ACTIVATE:
        case ACTION.ACTIVATE_WINDOW: {
            let appKey = action.payload.appKey;
            let windowKey = action.payload.windowKey;
            activateWindow(state, appKey, windowKey);
            return { ...state };
        }
        case ACTION.UNREGISTER_WINDOW: {
            let appKey = action.payload.appKey;
            let windowKey = action.payload.windowKey;
            if (state[appKey]) {
                delete state[appKey][windowKey];
            }
            return { ...state };
        }
        // When logout, close all apps
        case ACTION.SERVER_LOGOUT:
        case ACTION.LOGOUT: {
            return {};
        }
        default:
            return state;
    }
}
