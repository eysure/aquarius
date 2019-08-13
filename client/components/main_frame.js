import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import MenuBar from "./MenuBar/menu_bar";
import Launchpad from "./Launchpad/launchpad";
import Dock from "./Dock";

import { R } from "../resources_feeder";
import { getActiveApp, getAppName, getAppShortCut, getInstalledApps } from "../app_utils";
import { Meteor } from "meteor/meteor";
import hotkeys from "hotkeys-js";

import MenuBarTimeWidget from "./MenuBar/menu_bar_time_widget";

import * as A from "../actions";
import { WINDOW_STATUS_MIN } from "./Window";

class MainFrame extends Component {
    state = {
        fullscreen: false
    };

    packLaunchpadApps() {
        if (!this.props.auth || !this.props.auth.apps) return null;

        let launchpadApps = [];
        this.props.auth.apps.map(app => {
            launchpadApps.push(getAppShortCut(app, this));
        });
        return launchpadApps;
    }

    toolBarTitle = app => {
        if (app) return getAppName(app.appKey, this.props.user);
        else return R.Str("COMPANY_NAME"); // If no active app now, show company name
    };

    handleLogout = () => {
        Meteor.logout(error => this.props.logout(error));
    };

    getMenuBarMenu = app => {
        let windowMenu = [];
        if (app) {
            let activeWindow = null;
            let windows = this.props.windows[app.appKey];
            windowMenu = [];

            for (let w in windows) {
                let isActive = windows[w].state.isActive;
                let windowStatus = windows[w].state.windowStatus;
                let prefix = "";
                let onClick = null;
                if (isActive) {
                    prefix = "✓";
                    activeWindow = windows[w];
                }
                if (windowStatus === WINDOW_STATUS_MIN) {
                    prefix = "♦";
                    onClick = windows[w].handleMin;
                } else {
                    onClick = windows[w].handleMouseDown;
                }

                windowMenu.push({
                    title: windows[w].props.title || w,
                    prefix: prefix,
                    onClick
                });
            }

            if (windows && Object.keys(windows).length > 0)
                windowMenu = [
                    ...windowMenu,
                    { divider: true },
                    {
                        title: "Maximize",
                        extra: "⌘↩",
                        onClick: () => {
                            if (!app) return;
                            activeWindow.handleMax();
                        },
                        disabled: !activeWindow || !activeWindow.props.canMaximize
                    },
                    {
                        title: "Minimize",
                        extra: "⌘M",
                        onClick: () => {
                            if (!app) return;
                            activeWindow.handleMin();
                        },
                        disabled: !activeWindow || !activeWindow.props.canMinimize
                    },
                    {
                        title: "Close",
                        extra: "⌘⌫",
                        onClick: () => {
                            if (!app) return;
                            activeWindow.handleClose();
                        },
                        disabled: !activeWindow || !activeWindow.props.canClose
                    }
                ];
        }

        let mainMenuBarMenu = [
            {
                title: <img src="/assets/os_logo_white.png" />,
                submenu: [
                    getAppShortCut("about_system", this),
                    { divider: true },
                    getAppShortCut("preference", this),
                    { divider: true },
                    { title: "Recent Items", submenu: [] },
                    getAppShortCut("app_manager", this),
                    { divider: true },
                    {
                        title: R.Str("REFRESH"),
                        extra: "⌘R",
                        onClick: () => location.reload()
                    },
                    {
                        title: R.Str("LOGOUT_WITH_NAME", { user: this.props.user.nickname }),
                        extra: "⌘⎋",
                        onClick: () => Meteor.logout(error => this.props.logout(error))
                    }
                ]
            },
            {
                title: this.toolBarTitle(app),
                submenu: [
                    {
                        title: "Quit",
                        extra: "⌘⇧⌫",
                        onClick: () => {
                            if (!app) return;
                            this.props.appClose(app.appKey);
                        },
                        disabled: !app
                    }
                ]
            },
            {
                title: R.Str("WINDOW"),
                submenu: windowMenu
            },
            ...(app && app.manifest.menubar ? app.manifest.menubar : [])
        ];
        return mainMenuBarMenu;
    };

    getMenuBarExtra = () => {
        return [
            { key: "full-screen-btn", title: <i>{this.state.fullscreen ? "fullscreen_exit" : "fullscreen"}</i>, onClick: this.toggleFullscreen },
            { key: "time", title: <MenuBarTimeWidget /> },
            { key: "search", title: <i>search</i>, onClick: () => this.props.appLaunch("search") },
            { key: "toggle-notification-center", title: <i>list</i> }
        ];
    };

    toggleFullscreen = () => {
        if (document.fullscreenElement) {
            this.setState({ fullscreen: false });
            document.exitFullscreen();
        } else {
            this.setState({ fullscreen: true });
            document.documentElement.requestFullscreen();
        }
    };

    render() {
        let activeApp = getActiveApp(this.props.apps);
        return (
            <>
                <MenuBar menuBarMenu={this.getMenuBarMenu(activeApp)} menuBarExtra={this.getMenuBarExtra()} hide={this.props.system.menuBarHide} />
                <Launchpad open={this.props.system.launchpadStatus} items={this.packLaunchpadApps()} close={() => this.props.launchPadControl(false)} />
                <Dock />
            </>
        );
    }

    componentDidMount() {
        // Open Launcher
        hotkeys("cmd+l,ctrl+l,f1", (event, handler) => {
            event.preventDefault();
            this.props.launchPadControl(!this.props.system.launchpadStatus);
        });

        // Logout
        hotkeys("cmd+esc,ctrl+esc", (event, handler) => {
            event.preventDefault();
            Meteor.logout(error => this.props.logout(error));
        });

        // Prevent Save
        hotkeys("ctrl+s,cmd+s", function(event, handler) {
            event.preventDefault();
        });

        // Prevent Print
        hotkeys("ctrl+p,cmd+p", function(event, handler) {
            event.preventDefault();
        });

        // Prevent Print
        hotkeys("ctrl+d,cmd+d", function(event, handler) {
            event.preventDefault();
        });

        hotkeys("ctrl+p,cmd+p", function(event, handler) {
            event.preventDefault();
            console.log("lightpick");
        });

        // Quit app
        hotkeys("cmd+shift+backspace,ctrl+shift+backspace", { keydown: true }, (event, handler) => {
            event.preventDefault();
            let activeApp = getActiveApp(this.props.apps);
            if (!activeApp) return;
            let appKey = getActiveApp(this.props.apps).appKey;
            this.props.appClose(appKey);
        });
    }
}

const mapStateToProps = state => ({
    system: state.system,
    user: state.user,
    apps: state.apps,
    windows: state.windows,
    auth: state.auth
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(A, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainFrame);
