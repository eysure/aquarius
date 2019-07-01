import * as ACTION from "../actions";
import { getAppWithKey } from "../app_utils";
import _ from "lodash";

function extend(obj, src) {
    if (!src) return obj;
    if (!obj) return src;
    Object.appKeys(src).forEach(function(appKey) {
        obj[appKey] = src[appKey];
    });
    return obj;
}

function initializeAppGroup() {
    return {
        alwaysOnBackGroup: [],
        normalGroup: [],
        alwaysOnFrontGroup: []
    };
}

function pushApp(app, appGroup) {
    if (_.get(app, "option.alwaysOnBack")) appGroup.alwaysOnBackGroup.push(app);
    else if (_.get(app, "option.alwaysOnFront")) appGroup.alwaysOnFrontGroup.push(app);
    else appGroup.normalGroup.push(app);
    return appGroup;
}

function concatAppGroup(appGroup) {
    return appGroup.alwaysOnBackGroup.concat(appGroup.normalGroup, appGroup.alwaysOnFrontGroup);
}

export default function(state = {}, action) {
    switch (action.type) {
        // Launch an App
        case ACTION.APP_LAUNCH: {
            if (!action.payload || !action.payload.appKey) return state;

            let app = action.payload;
            let appKey = app.appKey;
            let option = app.option;

            let appClass = getAppWithKey(appKey);
            if (!appClass) return state; // No App found in the AppList

            app.manifest = appClass.manifest;
            app.status = 1;
            app.launchTime = new Date();
            app.option = extend(app.manifest.defaultOption, option);
            app.isActive = !_.get(app, "option.disableActive", false);
            return { ...state, [appKey]: app };
        }

        // Close an App
        case ACTION.APP_CLOSE: {
            let appKey = action.payload.appKey;
            delete state[appKey];
            return { ...state };
        }

        // Switch to an App by activate from app or its window.
        case ACTION.ACTIVATE_WINDOW:
        case ACTION.APP_WINDOW_ACTIVATE: {
            let appKey = action.payload.appKey;
            for (let app in state) {
                state[app].isActive = state[app].appKey === appKey;
            }
            return { ...state };
        }

        // Control an App
        case ACTION.APP_CONFIG: {
            let appKey = action.payload.appKey;
            let configuration = action.payload.configuration;

            if (state[appKey]) {
                Object.assign(state[appKey], configuration);
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
