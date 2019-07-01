import React from "react";
import { Icon } from "@material-ui/core";
import { getLanguage } from "./components/string_component";
import AppList from "./app_list";
import _ from "lodash";

const parameterCss = "color: #ffe250; background-color: #382800; padding: 2px; border-radius: 2px";

export function getInstalledApps() {
    return AppList;
}

export function getAppWithKey(appKey) {
    let app = AppList[appKey];
    if (!app) {
        console.error(
            "Can't find app with appKey: %c" + appKey + "%c in AppList, are you forget to add to list, or are you typo the appKey?",
            parameterCss,
            null
        );
        return null;
    }

    return app;
}

export function getAppManifest(appKey) {
    let app = getAppWithKey(appKey);
    if (!app) return null;

    let manifest = app.manifest;
    if (!manifest) console.error("Can't find manifest in app with appKey: %c" + appKey + "%c, are you forget to put manifest in your app?", parameterCss, null);
    return manifest;
}

export function getAppName(appKey, userProps) {
    if (!appKey) {
        console.error("appKey is not provided");
        return null;
    }
    let manifest = getAppManifest(appKey);
    if (!manifest) return appKey;
    return manifest.appName[getLanguage(userProps)];
}

export function getAppIcon(appKey, userProps, size, style = null) {
    let manifest = getAppManifest(appKey);
    if (!manifest) return null;
    return manifest.materialIcon ? (
        <Icon style={{ ...style, fontSize: size }}>{manifest.icon}</Icon>
    ) : (
        <img alt={getAppName(appKey, userProps)} className="img-icon" style={{ width: size, height: size }} src={manifest.icon} draggable={false} />
    );
}

export function getTabProps(appKey, tabKey) {
    let manifest = getAppManifest(appKey);
    if (!manifest) {
        console.error(
            "When getting tab props with tabKey %c" + tabKey + "%c, can't find manifest in app with appKey: %c" + appKey + "%c, see error msg above?",
            parameterCss,
            null,
            parameterCss,
            null
        );
        return null;
    }

    let tabProps = _.find(manifest.tabs, tab => {
        return tab.tabKey === tabKey;
    });

    if (!tabProps)
        console.error(
            "Can't find tab with tabKey: %c" + tabKey + "%c in app: %c" + appKey + "%c, are you forget to add tab to manifest.tabs, or have typo in tabKey?",
            parameterCss,
            null,
            parameterCss,
            null
        );
    return tabProps;
}

export function getTabName(appKey, tabKey, userProps) {
    let tabProps = getTabProps(appKey, tabKey);
    if (!tabProps) return getAppName(appKey, userProps) + "." + tabKey;

    return tabProps.tabName[getLanguage(userProps)];
}

export function getTabIcon(appKey, tabKey, userProps) {
    let tabProps = getTabProps(appKey, tabKey);
    if (!tabProps) return getAppIcon(appKey, userProps);

    return tabProps.materialIcon ? (
        <Icon>{getTabProps(appKey, tabKey).icon}</Icon>
    ) : (
        <img alt={getTabName(appKey, tabKey, userProps)} className="img-icon" src={getTabProps(appKey, tabKey).icon} />
    );
}

/**
 * Get the short cut of an app
 * @param {string} appKey: provide appKey
 * @param {Component} context: React component context, use to get local string and start the app
 */
export function getAppShortCut(appKey, context) {
    let name = getAppName(appKey, context.props.user);
    let icon = getAppManifest(appKey).icon;
    return {
        appKey: appKey,
        title: name,
        icon: icon,
        onClick: () => context.props.appLaunch(appKey)
    };
}

/**
 * Validate app with key. Use before launch app or get app's static props(App.manifest)
 * validation goes through app itself, then manifest, then appName
 * @param {string} appKey - provide appKey.
 *
 * @example
 * validateAppWithKey("desktop");
 * // { result: true }
 *
 * validateAppWithKey("fake_key");
 * // { result: false, reason: 1, description: "app cannot be found with request appKey" }
 *
 * validateAppWithKey("no_static_props");
 * // { result: false, reason: 2, description: "can't find manifest in app"}
 *
 * validateAppWithKey("no_app_name");
 * // { result: false, reason: 3, description: "Can't find appName in manifest"}
 *
 * @returns {object} Return a result object with boolean result, reason and description
 */
export function validateAppWithKey(appKey) {
    let App = AppList[appKey];
    if (!App) {
        return {
            result: false,
            reason: 1,
            description: "App cannot be found with request appKey"
        };
    }

    let manifest = App.manifest;
    if (!manifest) {
        return {
            result: false,
            reason: 2,
            description: "Can't find manifest in App"
        };
    }

    let appName = manifest.appName;
    if (!appName) {
        return {
            result: false,
            reason: 3,
            description: "Can't find appName in manifest"
        };
    }

    return { result: true };
}

export function getActiveApp(apps) {
    if (apps === null) return null;
    for (let appKey in apps) {
        if (apps[appKey].isActive) return apps[appKey];
    }
    return null;
}
