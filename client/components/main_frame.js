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
import _ from "lodash";

import Window from "./Window";

class MainFrame extends Component {
    state = {
        fullscreen: false,
        launchpadStatus: false
    };

    userApps = [];

    appsInitialize() {
        if (!this.props.auth || !this.props.auth.apps) return;

        this.userApps = [];

        this.props.auth.apps.map(appKey => {
            if (!validateAppWithKey(appKey).result) {
                console.error("Cannot validate appKey:", appKey, "\nIt's Highly possible when auth.apps contains a typo.");
            } else {
                const appShortcut = getAppShortCut(appKey, this);
                this.userApps.push(appShortcut);
                addRootOptions(appKey, {
                    title: appShortcut.title,
                    icon: <img src={appShortcut.icon} />,
                    onSelect: appShortcut.onClick
                });
            }
        });
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
                    key: windows[w].id,
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
                        disabled: !activeWindow || !activeWindow.canMaximize
                    },
                    {
                        title: "Minimize",
                        extra: "⌘M",
                        onClick: () => {
                            activeWindow.handleMin();
                        },
                        disabled: !activeWindow || !activeWindow.canMinimize
                    },
                    {
                        title: "Close",
                        extra: "⌘⌫",
                        onClick: () => {
                            activeWindow.handleClose();
                        },
                        disabled: !activeWindow || !activeWindow.canClose
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
                        disabled: !appKey || appKey === "system"
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

    launchpadClose = () => {
        let launchpad = document.querySelector("#launchpad");
        if (!launchpad) return;
        launchpad.classList.remove("launchpad-enter");
        let eventListener = () => {
            launchpad.classList.remove("launchpad-close");
            launchpad.removeEventListener("animationend", eventListener);
            this.setState({ launchpadStatus: false });
        };
        launchpad.classList.add("launchpad-close");
        launchpad.addEventListener("animationend", eventListener);
    };

    renderSystemWindows = () => {
        if (!this.props.windows._windowPool) return null;
        const systemWindows = [];
        for (let [, window] of Object.entries(this.props.windows._windowPool)) {
            if (!window.key) console.error("No window key is provided in the window");
            else systemWindows.push(window);
        }
        return systemWindows;
    };

    render() {
        return (
            <>
                <MenuBar menuBarMenu={this.getMenuBarMenu()} menuBarExtra={this.getMenuBarExtra()} hide={this.props.system.menuBarHide} />
                {this.renderSystemWindows()}
                <Launchpad
                    open={this.state.launchpadStatus}
                    items={this.userApps}
                    close={() => {
                        this.props.systemControl({ launchpadStatus: false });
                    }}
                />
                <Dock />
                <Cardinal ref={this.cardinalRef} onClose={() => this.props.systemControl({ cardinalOpen: false })} open={this.props.system.cardinalOpen} />
            </>
        );
    }

    addSystemCommands = () => {
        addCommand("sys", Object.keys(this.props.system).map(key => ({ key, value: this.props.system[key].toString() })), { keys: ["key", "value"] }, item => ({
            title: item.key,
            subtitle: item.value,
            icon: <img src={"/assets/icons/equipement.svg"} />
        }));
        addRootOptions("logout", {
            title: "Log Out",
            subtitle: `Log Out current user`,
            icon: <img src={"/assets/icons/equipement.svg"} />,
            onSelect: () => Meteor.logout(error => this.props.logout(error))
        });
        addRootOptions("debug_window", {
            title: "Create Demo Window",
            subtitle: "Display a full featured window",
            onSelect: () => {
                this.props.addWindow(
                    <Window
                        key={"tester"}
                        _key={"tester"}
                        height={300}
                        width={400}
                        x={"64px"}
                        y={"64px"}
                        title="Window Title"
                        onClose={() => this.props.closeWindow("system", "tester")}
                        toolbar={
                            <>
                                <button className="aqui-toolbar-btn">NRM</button>
                                <button className="aqui-toolbar-btn active">ACT</button>
                                <button className="aqui-toolbar-btn" disabled>
                                    DAB
                                </button>
                                <button className="aqui-toolbar-btn selected">SLT</button>
                                <div className="aqui-toolbar-btn-group">
                                    <button className="aqui-toolbar-btn">GP1</button>
                                    <button className="aqui-toolbar-btn">GP2</button>
                                    <button className="aqui-toolbar-btn">GP3</button>
                                </div>
                            </>
                        }
                    />
                );
            }
        });
    };

    componentDidMount() {
        // Open Launcher
        hotkeys("cmd+p,ctrl+p,f1", event => {
            event.preventDefault();
            this.props.systemControl({ launchpadStatus: !this.props.system.launchpadStatus });
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

        // Quit app
        hotkeys("cmd+shift+backspace,ctrl+shift+backspace", { keydown: true }, event => {
            event.preventDefault();
            let appKey = this.getActiveApp();
            this.props.appClose(appKey);
        });

        document.addEventListener("keydown", this.keydownListerner);

        // Add commands to cardinal
        this.addSystemCommands();
        // addCommand(
        //     "sup",
        //     () => {
        //         return Collection("suppliers")
        //             .find()
        //             .fetch();
        //     },
        //     { keys: ["name", "abbr"] },
        //     item => ({
        //         title: item.name,
        //         subtitle: item.abbr,
        //         onSelect: () => {
        //             console.log("Supplier select: ", item);
        //         }
        //     }),
        //     {
        //         pinyinTokenized: true
        //     }
        // );
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props.auth.apps, prevProps.auth.apps)) {
            this.appsInitialize();
        }
        if (!_.isEqual(this.props.system.launchpadStatus, prevProps.system.launchpadStatus)) {
            if (this.props.system.launchpadStatus) {
                this.setState({ launchpadStatus: true });
            } else {
                this.launchpadClose();
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keydownListerner);
    }

    keydownListerner = e => {
        if ((e.keyCode === 32 && e.metaKey) || e.keyCode === 36) {
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
    throwMsg: PropTypes.func,
    systemControl: PropTypes.func,
    addWindow: PropTypes.func,
    closeWindow: PropTypes.func
};
