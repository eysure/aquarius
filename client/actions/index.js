import { getMsg } from "../utils";
import { R } from "../resources_feeder";

// actions define several functions can be called to get data from back-end,
// then the reducer will be called

import { validateAppWithKey } from "../app_utils";

export const FETCH_USER_INFO = "FETCH_USER_INFO";
export const BIND_USER_INFO = "BIND_USER_INFO";
export const BIND_AUTH = "BIND_AUTH";
export const GET_USER_DETAIL = "GET_USER_DETAIL";
export const LOGOUT = "LOGOUT";
export const MENU_ITEMS_FETCH = "MENU_ITEMS_FETCH";
export const MENU_ITEM_SELECTED = "MENU_ITEM_SELECTED";
export const INTERNAL_MSG = "INTERNAL_MSG";
export const CLOSE_MSG = "CLOSE_MSG";
export const CLEAR_MSG = "CLEAR_MSG";
export const CHANGE_LANGUAGE_LOCAL = "CHANGE_LANGUAGE_LOCAL";
export const SYSTEM_CONTROL = "SYSTEM_CONTROL";
export const LAUNCHPAD_CONTROL = "LAUNCHPAD_CONTROL";

export const APP_LAUNCH = "APP_LAUNCH";
export const APP_LAUNCH_DEPRECATED = "APP_LAUNCH_DEPRECATED";
export const APP_CLOSE = "APP_CLOSE";
export const APP_CONFIG = "APP_CONFIG";

export const UPDATE_SALES_ORDER = "UPDATE_SALES_ORDER";
export const DELETE_SALES_ORDER = "DELETE_SALES_ORDER";

export const BIND_COLLECTION = "BIND_COLLECTION";
export const BIND_COLLECTIONS = "BIND_COLLECTIONS";

export const ACTIVATE_WINDOW = "ACTIVATE_WINDOW";
export const DEACTIVATE_WINDOW = "DEACTIVATE_WINDOW";
export const REGISTER_WINDOW = "REGISTER_WINDOW";
export const UNREGISTER_WINDOW = "UNREGISTER_WINDOW";

export function logout(msg = null) {
    msg = msg ? msg : R.get("LOGOUT_OK");
    return {
        type: LOGOUT,
        payload: {
            data: {
                msg
            }
        }
    };
}

export function bindUserInfo(user) {
    return {
        type: BIND_USER_INFO,
        payload: {
            data: user
        }
    };
}

export function bindAuth(auth) {
    return {
        type: BIND_AUTH,
        payload: {
            auth
        }
    };
}

// ---------------------------------------------------------------------------------------------------------------------
export function systemControl(system) {
    return {
        type: SYSTEM_CONTROL,
        payload: {
            system
        }
    };
}

export function throwMsg(msg, args = null) {
    // TODO: Back compatible, no longer support in current version
    if (typeof msg === "string" || msg instanceof String) {
        msg = {
            title: msg,
            class: 1
        };
    }

    return {
        type: INTERNAL_MSG,
        payload: {
            data: { msg }
        }
    };
}

export function clearMsg() {
    return {
        type: CLEAR_MSG,
        payload: null
    };
}

export function closeMsg(key) {
    return {
        type: CLOSE_MSG,
        payload: { key }
    };
}

export function selectMenuItem(menuItem) {
    return {
        type: MENU_ITEM_SELECTED,
        payload: menuItem
    };
}

export function changeLanguageLocal(language) {
    return {
        type: CHANGE_LANGUAGE_LOCAL,
        payload: { language }
    };
}

export function launchPadControl(status) {
    return {
        type: LAUNCHPAD_CONTROL,
        payload: {
            data: {
                launchpadStatus: status
            }
        }
    };
}

/**
 * Launcher to launch an Application
 */
export function appLaunch(appKey, option = null) {
    // Validate app before launch to avoid error
    let report = validateAppWithKey(appKey);
    if (!report.result) {
        console.error("App validation failed: " + report.description);

        let msgContent = `${report.description}\\n\\nappKey: ${appKey}\\nstartOption: ${JSON.stringify(startOption)}`;

        return {
            type: INTERNAL_MSG,
            payload: {
                data: { msg: getMsg("APP_LAUNCH_FAILED", { msgContent }) }
            }
        };
    }

    // Validation successful, ready to push App to runtime
    return {
        type: APP_LAUNCH,
        payload: {
            appKey,
            option
        }
    };
}

export function appClose(appKey, option = null) {
    return {
        type: APP_CLOSE,
        payload: {
            appKey,
            option
        }
    };
}

export function appConfig(appKey, configuration) {
    return {
        type: APP_CONFIG,
        payload: {
            appKey,
            configuration
        }
    };
}

export function bindCollection(name, collection) {
    return {
        type: BIND_COLLECTION,
        payload: {
            name,
            collection
        }
    };
}

/**
 * Active window inside app.
 * If no windowKey is provided, reducer will activate the last window in this app.
 * @param {string} appKey
 * @param {string} windowKey
 */
export function activateWindow(appKey, windowKey = null) {
    return {
        type: ACTIVATE_WINDOW,
        payload: {
            appKey,
            windowKey
        }
    };
}

/**
 * Deactivate window. Reducer will activate the last window in this app, or the last window if no other window is inside this app.
 * If windowKey is null, the last window not belongs to this app will be activated.
 * If appKey is null, desktop will be activated.
 * @param {string} appKey
 * @param {string} windowKey
 */
export function deactivateWindow(appKey = null, windowKey = null) {
    return {
        type: DEACTIVATE_WINDOW,
        payload: {
            appKey,
            windowKey
        }
    };
}

/**
 * Register a window. Use when a window is mount. This window will add to the end of the chain and be activated (same thing).
 * @param {string} appKey
 * @param {*} windowKey
 * @param {React.Component} window
 */
export function registerWindow(appKey, windowKey, window) {
    return {
        type: REGISTER_WINDOW,
        payload: {
            appKey,
            windowKey,
            window
        }
    };
}

/**
 * Unregister a window. Use when a window will unmount. Reducer will also deactivate this window and activate the last window in chain.
 * @param {string} appKey
 * @param {string} windowKey
 */
export function unregisterWindow(appKey, windowKey) {
    return {
        type: UNREGISTER_WINDOW,
        payload: {
            appKey,
            windowKey
        }
    };
}

export function updateSalesOrder() {
    // TODO: add function
    return {
        type: UPDATE_SALES_ORDER,
        payload: {
            msg: {
                title: ["Sales order updated.", "订单已更新"],
                class: 2
            }
        }
    };
}

export function deleteSalesOrder() {
    // TODO: add function
    return {
        type: DELETE_SALES_ORDER,
        payload: {
            msg: {
                title: ["Sales order deleted.", "订单已删除"],
                class: 2
            }
        }
    };
}
