import {
    APP_LAUNCH,
    APP_CLOSE,
    APP_WINDOW_ACTIVATE,
    APP_CONFIG,
    LOGIN,
    LOGOUT,
    SERVER_LOGOUT
} from "../actions";
import { getAppWithKey } from "../app_utils";
import _ from "lodash";

function extend(obj, src) {
    if (src === null || src === undefined) return obj;
    else if (obj === null || obj === undefined) return src;
    Object.keys(src).forEach(function(key) {
        obj[key] = src[key];
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
    else if (_.get(app, "option.alwaysOnFront"))
        appGroup.alwaysOnFrontGroup.push(app);
    else appGroup.normalGroup.push(app);
    return appGroup;
}

function concatAppGroup(appGroup) {
    return appGroup.alwaysOnBackGroup.concat(
        appGroup.normalGroup,
        appGroup.alwaysOnFrontGroup
    );
}

export default function(state = [], action) {
    switch (action.type) {
        // Launch an App
        case APP_LAUNCH: {
            if (!action.payload) return state; // Canceled by action
            let thisApp = action.payload;
            let App = getAppWithKey(thisApp.key);
            if (!App) {
                console.error(
                    `%cFATAL ERROR: App with appKey: '${
                        thisApp.key
                    }' can't be found during the reducing. This should be scaned in action dispatch. This app will not be add to the runtime.%c`,
                    "font-weight: 800; color: #ff7100; background-color: black; padding: 2px; border-radius: 2px;",
                    null
                );
                return state;
            }

            let appGroup = initializeAppGroup();
            for (let i = 0; i < state.length; i++) {
                if (state[i].key !== thisApp.key) {
                    state[i].isActive = false;
                    pushApp(state[i], appGroup);
                }
            }

            // Add this app
            thisApp.appStaticProps = App.appStaticProps; // Tell state this app's basic info (appName, icon ...)
            thisApp.status = 1; // Make this app to normal status
            thisApp.launchTime = new Date();
            thisApp.option = extend(
                thisApp.appStaticProps.defaultOption,
                action.payload.startOption
            ); // Overwrite the app's default option with the option giving when open this app
            thisApp.isActive = !_.get(thisApp, "option.disableActive", false); // push this app to front
            pushApp(thisApp, appGroup); // push app to group
            return concatAppGroup(appGroup);
        }

        // Close an App
        case APP_CLOSE: {
            let key = action.payload.key;
            let newList = [];
            for (let i = 0; i < state.length; i++) {
                if (state[i].key !== key) newList.push(state[i]);
            }

            if (newList.length === 0) return [];
            return newList;
        }

        // Switch to an App
        case APP_WINDOW_ACTIVATE: {
            let thisApp = null;
            let key = action.payload.key;
            let appGroup = initializeAppGroup();
            for (let i = 0; i < state.length; i++) {
                state[i].isActive = state[i].key === key; // Set the active status
                if (state[i].key === key) thisApp = state[i];
                // save the current app, push in the end
                else pushApp(state[i], appGroup); // push other apps
            }
            if (thisApp) pushApp(thisApp, appGroup); // Push this App
            return concatAppGroup(appGroup);
        }

        case APP_CONFIG: {
            let thisApp = null;
            let key = action.payload.key;
            for (let i = 0; i < state.length; i++) {
                if (state[i].key === key) {
                    thisApp = state[i];
                    break;
                }
            }

            if (thisApp) {
                thisApp = Object.assign(thisApp, action.payload.configuration);
            }

            return [...state];
        }

        // When logout, close all apps
        case SERVER_LOGOUT:
        case LOGOUT: {
            return [];
        }

        default:
            return state;
    }
}
