import hotkeys from "hotkeys-js";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as A from "../actions";
import { getAppName, getAppShortCut } from "../app_utils";
import { R } from "../resources_feeder";
import Dock from "./Dock";
import Launchpad from "./Launchpad/launchpad";
import MenuBar from "./MenuBar/menu_bar";
import MenuBarTimeWidget from "./MenuBar/menu_bar_time_widget";
import { WINDOW_STATUS_MIN } from "./Window";

class MainFrame extends Component {
    state = {
        fullscreen: false
    };

    packLaunchpadApps() {
        if (!this.props.auth || !this.props.auth.apps) return [];

        let launchpadApps = [];
        this.props.auth.apps.map(app => {
            launchpadApps.push(getAppShortCut(app, this));
        });
        return launchpadApps;
    }

    toolBarTitle = appKey => {
        // If no active app now, show company name
        if (!appKey || appKey === "system") return R.get("COMPANY_NAME");
        else return getAppName(appKey, this.props.user);
    };

    handleLogout = () => {
        Meteor.logout(error => this.props.logout(error));
    };

    getMenuBarMenu = () => {
        let appKey = this.getActiveApp();
        let windowMenu = [];
        if (appKey) {
            let activeWindow = null;
            let windows = this.props.windows[appKey];
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
                            activeWindow.handleMax();
                        },
                        disabled: !activeWindow || !activeWindow.props.canMaximize
                    },
                    {
                        title: "Minimize",
                        extra: "⌘M",
                        onClick: () => {
                            activeWindow.handleMin();
                        },
                        disabled: !activeWindow || !activeWindow.props.canMinimize
                    },
                    {
                        title: "Close",
                        extra: "⌘⌫",
                        onClick: () => {
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
                        title: R.get("REFRESH"),
                        extra: "⌘R",
                        onClick: () => location.reload()
                    },
                    {
                        title: R.get("LOGOUT_WITH_NAME", { user: this.props.user.nickname }),
                        extra: "⌘⎋",
                        onClick: () => Meteor.logout(error => this.props.logout(error))
                    }
                ]
            },
            {
                title: this.toolBarTitle(appKey),
                submenu: [
                    {
                        title: "Quit",
                        extra: "⌘⇧⌫",
                        onClick: () => {
                            this.props.appClose(appKey);
                        },
                        disabled: !appKey
                    }
                ]
            },
            {
                title: R.get("WINDOW"),
                submenu: windowMenu
            }
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
        return (
            <>
                <MenuBar menuBarMenu={this.getMenuBarMenu()} menuBarExtra={this.getMenuBarExtra()} hide={this.props.system.menuBarHide} />
                <Launchpad open={this.props.system.launchpadStatus} items={this.packLaunchpadApps()} close={() => this.props.launchPadControl(false)} />
                <Dock />
            </>
        );
    }

    componentDidMount() {
        // Open Launcher
        hotkeys("cmd+l,ctrl+l,f1", event => {
            event.preventDefault();
            this.props.launchPadControl(!this.props.system.launchpadStatus);
        });

        // Logout
        hotkeys("cmd+esc,ctrl+esc", event => {
            event.preventDefault();
            Meteor.logout(error => this.props.logout(error));
        });

        // Prevent Save
        hotkeys("ctrl+s,cmd+s", function(event) {
            event.preventDefault();
        });

        // Prevent Print
        hotkeys("ctrl+p,cmd+p", function(event) {
            event.preventDefault();
        });

        // Prevent Print
        hotkeys("ctrl+d,cmd+d", function(event) {
            event.preventDefault();
        });

        hotkeys("shift+f", function(event) {
            event.preventDefault();
            console.log("lightpick");
        });

        // Quit app
        hotkeys("cmd+shift+backspace,ctrl+shift+backspace", { keydown: true }, event => {
            event.preventDefault();
            let appKey = this.getActiveApp();
            this.props.appClose(appKey);
        });
    }

    getActiveApp = () => {
        let awc = this.props.windows._awc;
        if (awc.length === 0) return null;
        return awc[awc.length - 1].split("::")[0];
    };
}

const mapStateToProps = state => ({
    system: state.system,
    user: state.user,
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

MainFrame.propTypes = {
    system: PropTypes.object,
    user: PropTypes.object,
    windows: PropTypes.object,
    auth: PropTypes.object,

    logout: PropTypes.func,
    appLaunch: PropTypes.func,
    appClose: PropTypes.func,
    launchPadControl: PropTypes.func,
    throwMsg: PropTypes.func
};
