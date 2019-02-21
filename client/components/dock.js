import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import ReactJson from "react-json-view";
import _ from "lodash";
import DropFile from "./drop_file";
import { Meteor } from "meteor/meteor";
import FlipMove from "react-flip-move";

import { getAppName } from "../app_utils";

import { appLaunch, appClose, appConfig, launchPadControl, appWindowActivate } from "../actions";
import { oss, fileUploadVerify } from "../utils";
import { R } from "../resources_feeder";

const dockContainerStyle = {
    height: "6vh",
    position: "fixed",
    bottom: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    transition: "300ms all",
    pointerEvents: "none"
};

const dockStyle = {
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(0,0,0,0.6)",
    borderBottom: 0,
    borderRadius: "6px 6px 0 0",
    padding: 8,
    paddingBottom: 0,
    boxSizing: "border-box",
    userSelect: "none",
    display: "flex",
    transition: "300ms all",
    pointerEvents: "all"
};

const dockItemStyle = {
    color: "white",
    fontFamily: "San Francisco",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 4px",
    transition: "300ms",
    transform: "scale(0)"
};

const dockItemImageStyle = {
    height: "calc(100% - 1.3vh)",
    width: "auto"
};

const dockItemStatusStyle = {
    color: "white",
    background: "rgba(255,255,255,0.7)",
    width: "0.3vh",
    height: "0.3vh",
    margin: "0.5vh",
    borderRadius: "100%",
    boxSizing: "border-box",
    transition: "300ms"
};

class Dock extends React.Component {
    render() {
        return (
            <div
                id="dock-container"
                style={{
                    ...dockContainerStyle,
                    bottom: this.props.system.dockHide ? "-6vh" : "0"
                }}
            >
                <FlipMove
                    id="dock"
                    enterAnimation="none"
                    leaveAnimation="none"
                    onContextMenu={this.onContextMenu}
                    style={dockStyle}
                >
                    <DockItem
                        id="di-launcher"
                        key="launcher"
                        img="/assets/apps/rocket.svg"
                        title="Launchpad"
                        onClick={e => this.props.launchPadControl(!this.props.system.launchpadStatus)}
                    />
                    {this.renderDockItems()}
                </FlipMove>
            </div>
        );
    }

    renderDockItems() {
        return _.map(this.props.apps, app => {
            return <AppDockItem key={app.key} app={app} />;
        });
    }

    onContextMenu = e => {
        e.preventDefault();
        // Context menu
    };
}

const AppDockItem = connect(
    null,
    dispatch => bindActionCreators({ appClose, appWindowActivate, appConfig }, dispatch)
)(
    class extends React.Component {
        render() {
            let app = this.props.app;
            return (
                <DockItem
                    id={"di-" + app.key}
                    key={app.key}
                    onClick={this.handleAppDockItemClick}
                    title={getAppName(app.key)}
                    img={app.appStaticProps.icon}
                    open={app.isActive}
                />
            );
        }

        handleAppDockItemClick = e => {
            let app = this.props.app;
            if (app.status === 2) {
                this.props.appConfig(app.key, { status: 1 }); // Make the window to the normal size
            } else this.props.appWindowActivate(app.key);
        };
    }
);

class DockItem extends React.Component {
    dockItemRef = React.createRef();
    render() {
        return (
            <UI.Tooltip title={this.props.title} placement="top">
                <div id={this.props.id} ref={this.dockItemRef} style={dockItemStyle} onClick={this.props.onClick}>
                    <img style={dockItemImageStyle} src={this.props.img} />
                    <div
                        style={{
                            ...dockItemStatusStyle,
                            opacity: this.props.open ? 1 : 0
                        }}
                    />
                </div>
            </UI.Tooltip>
        );
    }

    componentDidMount() {
        let div = this.dockItemRef.current;
        if (!div) return;
        div.style.transform = "scale(1)";
    }
}

function mapStateToProps(state) {
    return {
        apps: state.apps,
        user: state.user,
        system: state.system
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ appLaunch, appClose, appConfig, launchPadControl }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dock);
