import { REGISTER_WINDOW, UNREGISTER_WINDOW, ACTIVATE_WINDOW, DEACTIVATE_WINDOW, LOGOUT, deactivateWindow } from "../actions";
import _ from "lodash";

defaultState = {
    system: {},
    _awc: []
};

activeWindowChain = [];
lAct = null; // Last Active Window (appKey::windowKey)
cAct = null; // Current Active Window (appKey::windowKey)

activeWindowChainPush = (state, appKey, windowKey) => {
    if (activeWindowChain.length > 0 && activeWindowChain[activeWindowChain.length - 1] === appKey + "::" + windowKey) return;
    lAct = getCurrent();
    activeWindowChainRemove(state, appKey, windowKey);
    activeWindowChain.push(appKey + "::" + windowKey);
    cAct = getCurrent();
};

activeWindowChainRemove = (state, appKey, windowKey) => {
    let index = activeWindowChainFetch(appKey, windowKey);
    if (index === -1) return -1;
    if (index === activeWindowChain.length - 1) {
        lAct = getCurrent();
    }
    activeWindowChain.splice(index, 1);
    cAct = getCurrent();
    return index;
};

activeWindowChainFetch = (appKey, windowKey) => {
    return activeWindowChain.indexOf(appKey + "::" + windowKey);
};

activateWindow = (state, appKey, windowKey) => {
    if (!appKey) {
        // If appKey is not set, throw an error
        console.error("appKey is not set when activating window.");
    } else if (windowKey) {
        // Activate the appKey::windowKey.
        activeWindowChainPush(state, appKey, windowKey);
    } else {
        // If windowKey is not set, active the last window in this app, if exist.
        for (let i = activeWindowChain.length - 1; i >= 0; i--) {
            if (activeWindowChain[i].split("::")[0] === appKey) {
                activeWindowChainPush(state, appKey, activeWindowChain[i].split("::")[1]);
                return;
            }
        }
    }
};

getCurrent = () => {
    return activeWindowChain.length > 0 ? activeWindowChain[activeWindowChain.length - 1] : null;
};

deactivateWindow = (state, appKey, windowKey) => {
    if (!appKey) {
        activeWindowChainPush(state, "system", "desktop");
        console.warn("Attempt to deactivate all windows, in what senario are you doing this?");
    } else if (windowKey) {
        activeWindowChainRemove(state, appKey, windowKey);
    } else {
        for (let i = activeWindowChain.length - 1; i >= 0; i--) {
            if (activeWindowChain[i].split("::")[0] !== appKey) {
                activeWindowChainPush(state, activeWindowChain[i].split("::")[0], activeWindowChain[i].split("::")[1]);
                return;
            }
        }
        activeWindowChainPush(state, "system", "desktop");
    }
};

setStateToWindow = (keys, state, isActive) => {
    if (!keys) return;
    let [appKey, windowKey] = keys.split("::");

    let app = state[appKey];
    if (!app) return;
    let window = app[windowKey];
    if (!window) return;

    if (window.state.isActive !== isActive) {
        window.setState({ isActive });
        if (isActive) window.restoreWindowPosition();
    }
};

responsibleActionType = new Set([REGISTER_WINDOW, UNREGISTER_WINDOW, ACTIVATE_WINDOW, DEACTIVATE_WINDOW, LOGOUT]);

export default function(state = defaultState, action) {
    if (!responsibleActionType.has(action.type)) return state;

    let { appKey, windowKey, window } = action.payload;
    switch (action.type) {
        case REGISTER_WINDOW: {
            if (!state[appKey]) state[appKey] = {};
            state[appKey][windowKey] = window;
            activateWindow(state, appKey, windowKey);
            break;
        }
        case UNREGISTER_WINDOW: {
            if (state[appKey]) {
                delete state[appKey][windowKey];
                deactivateWindow(state, appKey, windowKey);
            }
            if (Object.keys(state[appKey]).length === 0) {
                delete state[appKey];
            }
            break;
        }
        case ACTIVATE_WINDOW: {
            activateWindow(state, appKey, windowKey);
            break;
        }
        case DEACTIVATE_WINDOW: {
            deactivateWindow(state, appKey, windowKey);
            break;
        }
        case LOGOUT: {
            // When logout, close all apps
            activeWindowChain = [];
            lAct = null;
            cAct = null;
            state = {};
            break;
        }
        default:
            break;
    }

    setStateToWindow(lAct, state, false);
    setStateToWindow(cAct, state, true);

    state._awc = activeWindowChain;
    return { ...state };
}
