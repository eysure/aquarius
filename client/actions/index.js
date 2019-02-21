import { getMsg } from "../utils";
import { R } from "../resources_feeder";

// actions define several functions can be called to get data from back-end,
// then the reducer will be called

import { validateAppWithKey } from "../app_utils";

export const FETCH_USER_INFO = "FETCH_USER_INFO";
export const BIND_USER_INFO = "BIND_USER_INFO";
export const BIND_EMPLOYEES_INFO = "BIND_EMPLOYEES_INFO";
export const GET_USER_DETAIL = "GET_USER_DETAIL";
export const LOGOUT = "LOGOUT";
export const SERVER_LOGOUT = "SERVER_LOGOUT";
export const MENU_ITEMS_FETCH = "MENU_ITEMS_FETCH";
export const MENU_ITEM_SELECTED = "MENU_ITEM_SELECTED";
export const INTERNAL_MSG = "INTERNAL_MSG";
export const CLOSE_MSG = "CLOSE_MSG";
export const CLEAR_MSG = "CLEAR_MSG";
export const CHANGE_LANGUAGE_LOCAL = "CHANGE_LANGUAGE_LOCAL";
export const SYSTEM_CONTROL = "SYSTEM_CONTROL";
export const LAUNCH_PAD_CONTROL = "LAUNCH_PAD_CONTROL";

export const APP_LAUNCH = "APP_LAUNCH";
export const APP_CLOSE = "APP_CLOSE";
export const APP_WINDOW_ACTIVATE = "APP_WINDOW_ACTIVATE";
export const APP_CONFIG = "APP_CONFIG";

export const UPDATE_SALES_ORDER = "UPDATE_SALES_ORDER";
export const DELETE_SALES_ORDER = "DELETE_SALES_ORDER";

export const BIND_COLLECTION = "BIND_COLLECTION";
export const BIND_COLLECTIONS = "BIND_COLLECTIONS";

export function logout(error = null, option = null) {
    let msg = error ? R.Msg("LOGOUT_ERR", { error }) : R.Msg("LOGOUT_OK");
    return {
        type: LOGOUT,
        payload: {
            data: {
                msg,
                ...option
            }
        }
    };
}

export function serverLogout() {
    let msg = R.Msg("SERVER_LOG_OUT");
    return {
        type: SERVER_LOGOUT,
        payload: { data: { msg } }
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

export function bindUserInfo(user) {
    return {
        type: BIND_USER_INFO,
        payload: {
            data: user,
            msg: R.Msg("LOGIN_SUCCESSFUL", {
                username: user.username || user.email
            })
        }
    };
}

export function bindEmployeesInfo(employees) {
    return {
        type: BIND_EMPLOYEES_INFO,
        payload: { data: employees }
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
    // TODO: Back compatible, no longer support in next version
    if (typeof msg === "string" || msg instanceof String) {
        console.warn(
            "Deprecated: Throw a message by key in action function is deprecated and no longer support in next version"
        );
        msg = getMsg(msg, args);
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

/**
 * Launcher to launch an Application
 */
export function appLaunch(appKey, startOption = null) {
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
            key: appKey,
            startOption
        }
    };
}

export function launchPadControl(status) {
    return {
        type: LAUNCH_PAD_CONTROL,
        payload: {
            data: {
                launchpadStatus: status
            }
        }
    };
}

export function appClose(key, option = null) {
    return {
        type: APP_CLOSE,
        payload: {
            key,
            option
        }
    };
}

export function appWindowActivate(key, option) {
    return {
        type: APP_WINDOW_ACTIVATE,
        payload: {
            key,
            option
        }
    };
}

export function appConfig(key, configuration) {
    return {
        type: APP_CONFIG,
        payload: {
            key,
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

export function bindCollections(collections) {
    return {
        type: BIND_COLLECTIONS,
        payload: collections
    };
}
