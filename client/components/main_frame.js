import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import MenuBar from "./MenuBar/menu_bar";
import Launchpad from "./Launchpad/launchpad";
import Dock from "./dock";

import { R } from "../resources_feeder";
import { getActiveApp, getAppName, getAppShortCut } from "../app_utils";
import { Meteor } from "meteor/meteor";

import * as A from "../actions";

import AppList from "../app_list";

class MainFrame extends Component {
    state = {
        fullscreen: false,
        currentTime: new Date()
    };

    packLaunchpadApps(installedApps) {
        let launchpadApps = [];
        let appKeys = Object.keys(installedApps);
        if (appKeys && appKeys.length > 0)
            appKeys.map(appKey => {
                launchpadApps.push(getAppShortCut(appKey, this));
            });
        return launchpadApps;
    }

    toolBarTitle = () => {
        let activeApp = getActiveApp(this.props.apps); // Get active app first
        if (activeApp) return getAppName(activeApp.key, this.props.user);
        else return R.Str("COMPANY_NAME"); // If no active app now, show company name
    };

    handleLogout = () => {
        Meteor.logout(error => this.props.logout(error));
    };

    getMenuBarMenu = () => {
        let mainMenuBarMenu = [
            {
                title: <img src="/assets/os_logo_white.png" />,
                submenu: [
                    getAppShortCut("preference", this),
                    { divider: true },
                    { title: "System Preference..." },
                    { title: "App Store..." },
                    { divider: true },
                    { title: "Recent Items", submenu: [] },
                    { title: "Force Quit..." },
                    { divider: true },
                    {
                        title: R.Str("LOGOUT_WITH_NAME", { user: this.props.user.fn_en }),
                        extra: "⌘⎋",
                        onClick: () => Meteor.logout(error => this.props.logout(error))
                    }
                ]
            },
            { title: "AquariusOS", submenu: [] },
            { title: "Application Menu", submenu: [] },
            {
                title: R.Str("FILE"),
                submenu: [
                    { title: "Sub 1" },
                    { title: "Sub 2" },
                    { title: "Sub sub menu", submenu: [{ title: "Sub sub 1" }, { title: "sub sub 2", submenu: [{ title: "sub end" }] }] }
                ]
            },
            {
                title: R.Str("EDIT"),
                submenu: [
                    { title: "Sub 1" },
                    { title: "Sub 2" },
                    { title: "Sub sub menu", submenu: [{ title: "Sub sub 1" }, { title: "sub sub 2", submenu: [{ title: "sub end" }] }] }
                ]
            },
            {
                title: R.Str("VIEW"),
                submenu: [
                    { title: "Sub 1" },
                    { title: "Sub 2" },
                    { title: "Sub sub menu", submenu: [{ title: "Sub sub 1" }, { title: "sub sub 2", submenu: [{ title: "sub end" }] }] }
                ]
            },
            {
                title: R.Str("WINDOW"),
                submenu: []
            },
            {
                title: R.Str("HELP"),
                submenu: []
            }
        ];
        return mainMenuBarMenu;
    };

    getMenuBarExtra = () => {
        return [
            { key: "full-screen-btn", title: <i>{this.state.fullscreen ? "fullscreen_exit" : "fullscreen"}</i>, onClick: this.toggleFullscreen },
            { key: "time", title: this.state.currentTime.toLocaleString() },
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
                <Launchpad open={this.props.system.launchpadStatus} items={this.packLaunchpadApps(AppList)} close={() => this.props.launchPadControl(false)} />
                <Dock />
            </>
        );
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ currentTime: new Date() });
        }, 1000);
    }
}

const mapStateToProps = state => ({
    system: state.system,
    user: state.user
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(A, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainFrame);
