import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import ReactJson from "react-json-view";
import _ from "lodash";
import DropFile from "./drop_file";
import { Meteor } from "meteor/meteor";

import DesktopContextMenu from "../components/desktop_context_menu";
import { throwMsg, appWindowActivate, launchPadControl } from "../actions";
import { oss, fileUploadVerify, upload } from "../utils";
import { R } from "../resources_feeder";

const desktopMainStyle = {
    width: "100%",
    height: "calc(100% - 36px)",
    color: "white",
    position: "fixed",
    bottom: 0,
    overflow: "hidden"
};

const desktopImageStyle = {
    objectFit: "cover",
    maxHeight: "100%",
    minWidth: "100%",
    transform: "scale(1.1)",
    overflow: "hidden",
    pointerEvents: "none"
};

class Desktop extends Component {
    state = {
        contextMenuOpen: false,
        contextMenuX: 0,
        contextMenuY: 0,
        backgroundUrl: null
    };

    onContextMenu = e => {
        e.preventDefault();
        this.setState({
            contextMenuOpen: true,
            contextMenuX: e.clientX,
            contextMenuY: e.clientY
        });
    };

    onContextMenuClose = () => {
        this.setState({
            contextMenuOpen: false
        });
    };

    onMouseUp = e => {
        if (e.button === 0) {
            this.onContextMenuClose();
        }
    };

    onMouseDown = e => {
        switch (e.button) {
            case 0: {
                this.props.appWindowActivate(null);
                break;
            }
            case 1: {
                this.props.launchPadControl(true);
            }
            case 2: {
                this.onContextMenuClose();
            }
        }
    };

    renderContextMenu() {
        return (
            <UI.Popover
                id="desktop-context-menu"
                open={this.state.contextMenuOpen}
                onClose={this.onContextMenuClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                anchorReference="anchorPosition"
                anchorPosition={{
                    top: this.state.contextMenuY,
                    left: this.state.contextMenuX
                }}
                transitionDuration={{
                    enter: 100,
                    exit: 200
                }}
                disablePortal={true}
                style={{ pointerEvents: "none" }}
            >
                <DesktopContextMenu onClose={this.onContextMenuClose} />
            </UI.Popover>
        );
    }

    handleDesktopUpload = e => {
        let file = e[0];
        if (!fileUploadVerify(file, this.props.throwMsg, R).result) return;

        upload(
            file,
            "uploadDesktop",
            null,
            () => {
                this.props.throwMsg(
                    R.Msg("FILE_UPLOADING", {
                        key: "DESKTOP_UPLOAD"
                    })
                );
            },
            (err, res) => {
                if (err) {
                } else {
                    // change localStorage
                    let employee = this.props.user;
                    localStorage.setItem(
                        "lastLoginUser",
                        JSON.stringify({
                            nickname: employee.nickname,
                            avatar: employee.avatar,
                            email: employee.email,
                            desktop: res
                        })
                    );

                    this.props.throwMsg(
                        R.Msg("FILE_UPLOADED", {
                            key: "DESKTOP_UPLOAD"
                        })
                    );

                    return true;
                }
            }
        );
    };

    render() {
        let url = oss(this.getBackgroundRelUrl());
        return (
            <div id="desktop-wapper" className="first-class-overlap" style={{ pointerEvents: "all", display: "flex" }}>
                <img
                    src={url}
                    style={{
                        ...desktopImageStyle,
                        filter: `blur(${this.props.system.blurScreen}px)`,
                        transition: "300ms"
                    }}
                />
                <div
                    id="desktop"
                    style={desktopMainStyle}
                    onContextMenu={this.onContextMenu}
                    onMouseUp={this.onMouseUp}
                    onMouseDown={this.onMouseDown}
                >
                    <DropFile handleDrop={this.handleDesktopUpload} style={desktopMainStyle} />
                </div>
                {this.renderContextMenu()}
            </div>
        );
    }

    renderStateDebugger() {
        return <ReactJson src={this.props.allStates} theme="monokai" />;
    }

    // Priority: user's preference > lastLoginUser > default
    getBackgroundRelUrl() {
        return (
            "assets/user/desktop/" +
            (_.get(this.props.user, "preferences.desktop", null) ||
                _.get(JSON.parse(localStorage.getItem("lastLoginUser")), "desktop", null) ||
                "default.jpg")
        );
    }
}

function mapStateToProps(state) {
    return { user: state.user, system: state.system };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg, appWindowActivate, launchPadControl }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Desktop);
