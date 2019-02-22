import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";

import { throwMsg, logout, appLaunch, launchPadControl } from "../actions";

import Str from "./string_component";

import { getAppName } from "../app_utils";
import { getActiveApp } from "../app_utils";
import AppMenuItem from "../components/app_menu_item";
import { Meteor } from "meteor/meteor";

import Launchpad from "./launchpad";
import Dock from "./dock";
import { R } from "../resources_feeder";

const headerHeight = 36;
const notificationWidth = 360;

const styles = {
    appBar: {
        height: headerHeight,
        background: "rgba(19,19,19,0.6)",
        position: "fixed",
        boxShadow: "none",
        transition: "300ms all",
        MozUserSelect: "none",
        WebkitUserSelect: "none",
        MsUserSelect: "none",
        userSelect: "none",
        overflow: "hidden"
    },
    toolbar: {
        minHeight: headerHeight,
        height: headerHeight,
        padding: "0 8px",
        justifyContent: "space-between"
    },
    toolbarGroup: {
        height: "100%",
        display: "flex",
        alignItems: "center"
    },
    notificationCenter: {
        backgroundColor: "#d7d7d7",
        opacity: 0.95,
        width: notificationWidth
    }
};

class MainFrame extends React.Component {
    state = {
        mainMenuOpen: false,
        userMenuAnchorEl: null,
        currentTime: new Date()
    };

    toolBarTitle = () => {
        // Get active app first
        let activeApp = getActiveApp(this.props.apps);
        // Else, show the app name
        if (activeApp) return getAppName(activeApp.key, this.props.user);
        // If no active app now, show company name
        else return <Str COMPANY_NAME />;
    };

    handleMainMenuClose = () => {
        this.setState({ mainMenuOpen: false });
    };

    handleLogout = () => {
        Meteor.logout(error => this.props.logout(error));
    };

    renderMainMenu() {
        return (
            <UI.Popover
                name="main-menu"
                open={this.state.mainMenuOpen}
                anchorEl={this.state.userMenuAnchorEl}
                onMouseDown={this.handleMainMenuClose}
                onClose={this.handleMainMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                transitionDuration={{
                    enter: 100,
                    exit: 200
                }}
            >
                <div>
                    <UI.ListItem button onClick={e => this.props.launchPadControl(true)}>
                        <UI.ListItemIcon>
                            <UI.Icon>view_comfy</UI.Icon>
                        </UI.ListItemIcon>
                        <UI.ListItemText primary={<Str LAUNCHPAD />} />
                    </UI.ListItem>
                    <UI.Divider />
                    <AppMenuItem appKey="about_system" />
                    <UI.ListItem button onClick={e => window.location.reload()}>
                        <UI.ListItemIcon>
                            <UI.Icon>refresh</UI.Icon>
                        </UI.ListItemIcon>
                        <UI.ListItemText primary={<Str REFRESH />} />
                    </UI.ListItem>
                    <UI.MenuItem onClick={this.handleLogout}>
                        <UI.ListItemIcon>
                            <UI.Icon>vpn_key</UI.Icon>
                        </UI.ListItemIcon>
                        <UI.ListItemText>
                            <Str LOGOUT />
                        </UI.ListItemText>
                    </UI.MenuItem>
                </div>
            </UI.Popover>
        );
    }

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
            <React.Fragment>
                <UI.AppBar
                    style={{
                        ...styles.appBar,
                        top: this.props.system.menuBarHide ? "-36px" : "0"
                    }}
                    onContextMenu={e => e.preventDefault()}
                >
                    <UI.Toolbar style={styles.toolbar}>
                        <div style={styles.toolbarGroup}>
                            <UI.Button
                                className="main-toolbar-button"
                                aria-haspopup="true"
                                color="inherit"
                                aria-label="open main menu"
                                onClick={e => {
                                    this.setState({
                                        mainMenuOpen: true,
                                        userMenuAnchorEl: e.currentTarget
                                    });
                                }}
                            >
                                <img style={{ height: "22px", width: "22px" }} src="/assets/os_logo_white.png" />
                            </UI.Button>
                            <UI.Button className="main-toolbar-button-bold" color="inherit">
                                {this.toolBarTitle()}
                            </UI.Button>
                            <UI.Button className="main-toolbar-button" color="inherit">
                                Toolbar Support Soon
                            </UI.Button>
                            <UI.Button className="main-toolbar-button" color="inherit" onClick={() => this.props.throwMsg(R.Msg("WHATS_LOREM_IPSUM"))}>
                                What's Lorem?
                            </UI.Button>
                            {this.renderMainMenu()}
                        </div>
                        <div style={styles.toolbarGroup}>
                            <UI.Button id="fullscreen-button" className="main-toolbar-button" color="inherit" onClick={() => this.props.appLaunch("search")}>
                                <UI.Icon>search</UI.Icon>
                            </UI.Button>
                            <UI.Button id="fullscreen-button" className="main-toolbar-button" color="inherit" onClick={this.toggleFullscreen}>
                                <UI.Icon>{this.state.fullscreen ? "fullscreen_exit" : "fullscreen"}</UI.Icon>
                            </UI.Button>
                            <UI.Button className="main-toolbar-button" color="inherit" aria-label="open notification center">
                                {this.state.currentTime.toLocaleString()}
                            </UI.Button>

                            <UI.Button className="main-toolbar-button" color="inherit" aria-label="open notification center">
                                <UI.Icon>list</UI.Icon>
                            </UI.Button>
                        </div>
                    </UI.Toolbar>
                </UI.AppBar>
                <Launchpad />
                <Dock />
            </React.Fragment>
        );
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ currentTime: new Date() });
        }, 1000);
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg, logout, appLaunch, launchPadControl }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.user,
        apps: state.apps,
        system: state.system
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainFrame);
