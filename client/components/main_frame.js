import hotkeys from "hotkeys-js";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as A from "../actions";
import { getAppName, getAppShortCut, validateAppWithKey } from "../app_utils";
import { R } from "../resources_feeder";
import Dock from "./Dock";
import Launchpad from "./Launchpad/launchpad";
import MenuBar from "./MenuBar/menu_bar";
import MenuBarTimeWidget from "./MenuBar/menu_bar_time_widget";
import { WINDOW_STATUS_MIN } from "./Window";
import Cardinal, { addCommand, addRootOptions } from "./cardinal";
import { Collection } from "../utils";

class MainFrame extends Component {
    state = {
        fullscreen: false
    };

    packLaunchpadApps() {
        if (!this.props.auth || !this.props.auth.apps) return [];

        let launchpadApps = [];
        this.props.auth.apps.map(appKey => {
            if (!validateAppWithKey(appKey).result) {
                console.error("Cannot validate appKey:", appKey, "\nIt's Highly possible when auth.app contains a typo.");
            } else launchpadApps.push(getAppShortCut(appKey, this));
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

    ac = () => {
        addCommand(
            "sup",
            Collection("suppliers")
                .find()
                .fetch(),
            { keys: ["name", "abbr"] },
            item => ({
                title: item.name,
                subtitle: item.abbr,
                onSelect: () => {
                    console.log("Supplier select: ", item);
                }
            }),
            {
                pinyinTokenized: true
            }
        );
        addCommand("sys", Object.keys(this.props.system).map(key => ({ key, value: this.props.system[key].toString() })), { keys: ["key", "value"] }, item => ({
            title: item.key,
            subtitle: item.value,
            icon: <img src={"/assets/icons/equipement.svg"} />
        }));
        addRootOptions("logout", {
            title: "Log Out",
            subtitle: `Log Out ${this.props.user.nickname}...`,
            icon: <img src={"/assets/icons/equipement.svg"} />,
            onSelect: () => Meteor.logout(error => this.props.logout(error))
        });
    };

    getMenuBarExtra = () => {
        return [
            { key: "addCommand", title: "Add Command", onClick: this.ac },
            { key: "full-screen-btn", title: <i>{this.state.fullscreen ? "fullscreen_exit" : "fullscreen"}</i>, onClick: this.toggleFullscreen },
            { key: "time", title: <MenuBarTimeWidget /> },
            {
                key: "search",
                title: <i>search</i>,
                onClick: () => {
                    this.props.systemControl({ cardinalOpen: !this.props.system.cardinalOpen });
                }
            },
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
                <Cardinal ref={this.cardinalRef} onClose={() => this.props.systemControl({ cardinalOpen: false })} open={this.props.system.cardinalOpen} />
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

        // hotkeys("ctrl+space,cmd+space", event => {
        //     event.preventDefault();
        //     this.props.systemControl({ cardinalOpen: !this.props.system.cardinalOpen });
        // });

        // Quit app
        hotkeys("cmd+shift+backspace,ctrl+shift+backspace", { keydown: true }, event => {
            event.preventDefault();
            let appKey = this.getActiveApp();
            this.props.appClose(appKey);
        });

        document.addEventListener("keydown", this.keydownListerner);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keydownListerner);
    }

    keydownListerner = e => {
        if (e.keyCode === 32 && e.metaKey) {
            this.props.systemControl({ cardinalOpen: !this.props.system.cardinalOpen });
        }
    };

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
    throwMsg: PropTypes.func,
    systemControl: PropTypes.func
};
