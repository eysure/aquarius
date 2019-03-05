import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Popover, ListItem, ListItemIcon, ListItemText, Divider } from "@material-ui/core";
import { R } from "../resources_feeder";

import { getAppName } from "../app_utils";
import { getActiveApp } from "../app_utils";
import AppMenuItem from "../components/app_menu_item";
import { Meteor } from "meteor/meteor";

import { throwMsg, logout, appLaunch, launchPadControl } from "../actions";

export class MenuBar extends Component {
    state = {
        mainMenuOpen: false,
        userMenuAnchorEl: null,
        currentTime: new Date()
    };

    toolBarTitle = () => {
        let activeApp = getActiveApp(this.props.apps); // Get active app first
        if (activeApp) return getAppName(activeApp.key, this.props.user);
        // Else, show the app name
        else return R.Str("COMPANY_NAME"); // If no active app now, show company name
    };

    handleMainMenuClose = () => {
        this.setState({ mainMenuOpen: false });
    };

    handleLogout = () => {
        Meteor.logout(error => this.props.logout(error));
    };

    renderMainMenu() {
        return (
            <Popover
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
                    <ListItem button onClick={e => this.props.launchPadControl(true)}>
                        <ListItemIcon>
                            <i className="material-icons">view_comfy</i>
                        </ListItemIcon>
                        <ListItemText primary={R.Str("LAUNCHPAD")} />
                    </ListItem>
                    <Divider />
                    <AppMenuItem appKey="about_system" />
                    <ListItem button onClick={e => window.location.reload()}>
                        <ListItemIcon>
                            <i className="material-icons">refresh</i>
                        </ListItemIcon>
                        <ListItemText primary={R.Str("REFRESH")} />
                    </ListItem>
                    <ListItem button onClick={this.handleLogout}>
                        <ListItemIcon>
                            <i className="material-icons">vpn_key</i>
                        </ListItemIcon>
                        <ListItemText>{R.Str("LOGOUT")}</ListItemText>
                    </ListItem>
                </div>
            </Popover>
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
            <div
                id="menu-bar-container"
                style={{
                    transform: this.props.system.menuBarHide ? "translate(0,-36px)" : "translate(0,0)"
                }}
                onContextMenu={e => e.preventDefault()}
            >
                <div id="menu-bar">
                    <div>
                        <button
                            aria-haspopup="true"
                            onClick={e => {
                                this.setState({
                                    mainMenuOpen: true,
                                    userMenuAnchorEl: e.currentTarget
                                });
                            }}
                        >
                            <img src="/assets/os_logo_white.png" />
                        </button>
                        <button style={{ fontWeight: 600 }}>{this.toolBarTitle()}</button>
                        <button>Toolbar Support Soon</button>
                        <button onClick={() => this.props.throwMsg(R.Msg("WHATS_LOREM_IPSUM"))}>What's Lorem?</button>
                        {this.renderMainMenu()}
                    </div>
                    <div id="menu-extra">
                        <button onClick={() => this.props.appLaunch("search")}>
                            <i>search</i>
                        </button>
                        <button onClick={this.toggleFullscreen}>
                            <i>{this.state.fullscreen ? "fullscreen_exit" : "fullscreen"}</i>
                        </button>
                        <button>{this.state.currentTime.toLocaleString()}</button>
                        <button>
                            <i>list</i>
                        </button>
                    </div>
                </div>
            </div>
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
)(MenuBar);
