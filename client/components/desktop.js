import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import DropFile from "./DropFile";
import { Meteor } from "meteor/meteor";

import Menu from "./Menus";
import { throwMsg, launchPadControl, activateWindow } from "../actions";
import { oss, fileUploadVerify, upload } from "../utils";
import { R } from "../resources_feeder";

import * as ACTION from "../actions";

const desktopMainStyle = {
    width: "100%",
    height: "calc(100% - 24px)",
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
    state = {};

    onMouseDown = e => {
        switch (e.button) {
            case 0: {
                this.props.activateWindow("system", "desktop");
                break;
            }
            case 1: {
                this.props.launchPadControl(true);
                break;
            }
        }
    };

    onContextMenu = e => {
        e.preventDefault();
        this.setState({
            desktopContextMenu: true,
            contextMenuX: e.clientX,
            contextMenuY: e.clientY
        });
    };

    renderContextMenu() {
        let contextMenu = [
            {
                title: R.Str("LAUNCHPAD"),
                extra: "⌘L",
                onClick: () => {
                    this.props.launchPadControl(true);
                }
            },
            {
                title: R.Str("SEARCH"),
                onClick: () => {
                    this.props.launchPadControl(true);
                }
            },
            { divider: true }
        ];

        // Recently used apps
        contextMenu.push({ title: R.Str("RECENTLY_USED_APPS"), isTitle: true });
        contextMenu.push({ title: R.Str("NONE"), isTitle: true });
        contextMenu.push({ divider: true });

        contextMenu.push({
            title: R.Str("LOGOUT_WITH_NAME", { user: this.props.user.nickname }),
            extra: "⌘⎋",
            onClick: () => Meteor.logout(error => this.props.logout(error))
        });

        return (
            <Menu
                context={this}
                name="desktopContextMenu"
                x={this.state.contextMenuX}
                y={this.state.contextMenuY}
                content={contextMenu}
                emptyMenuText={R.Str("EMPTY_MENU")}
            />
        );
    }

    handleDesktopUpload = e => {
        let file = e[0];
        if (!fileUploadVerify(file, this.props.throwMsg).result) return;

        upload(
            file,
            {
                db: "employees",
                findOne: { email: this.props.user.email },
                field: "preferences.desktop",
                auth: "db"
            },
            () => {
                this.props.throwMsg(
                    R.Msg("FILE_UPLOADING", {
                        key: "DESKTOP_UPLOAD"
                    })
                );
            },
            (err, res) => {
                if (err) {
                    this.props.throwMsg(
                        R.Msg("SERVER_ERROR", {
                            key: "DESKTOP_UPLOAD",
                            ...err
                        })
                    );
                } else {
                    this.props.throwMsg(
                        R.Msg("FILE_UPLOADED", {
                            key: "DESKTOP_UPLOAD"
                        })
                    );

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

                    return true;
                }
            }
        );
    };

    render() {
        let url = this.getBackgroundRelUrl();
        return (
            <div id="desktop-wapper" className="first-class-overlap" style={{ pointerEvents: "all", display: "flex" }}>
                <img
                    src={url}
                    style={{
                        ...desktopImageStyle,
                        filter: `blur(${this.props.system.blurScreen}px)`
                    }}
                />
                <div id="desktop" style={desktopMainStyle} onContextMenu={this.onContextMenu} onMouseDown={this.onMouseDown}>
                    <DropFile handleDrop={this.handleDesktopUpload} style={desktopMainStyle} />
                </div>
                {this.renderContextMenu()}
            </div>
        );
    }

    // Priority: user's preference > lastLoginUser > default
    getBackgroundRelUrl() {
        return oss(
            _.get(this.props.user, "preferences.desktop", null) ||
                _.get(JSON.parse(localStorage.getItem("lastLoginUser")), "desktop", null) ||
                "assets/employees/preferences.desktop/default.jpg"
        );
    }
}

function mapStateToProps(state) {
    return { user: state.user, system: state.system };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg, launchPadControl, logout: ACTION.logout, activateWindow }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Desktop);
