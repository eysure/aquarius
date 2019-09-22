import _ from "lodash";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { activateWindow, logout, throwMsg, systemControl } from "../actions";
import { R } from "../resources_feeder";
import { fileUploadVerify, oss, upload } from "../utils";
import DropFile from "./DropFile";
import Menu from "./Menus";

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
                this.props.systemControl({ launchpadStatus: !this.props.system.launchpadStatus });
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
                title: R.get("LAUNCHPAD"),
                extra: "⌘L",
                onClick: () => {
                    this.props.systemControl({ launchpadStatus: !this.props.system.launchpadStatus });
                }
            },
            {
                title: R.get("SEARCH"),
                onClick: () => {
                    this.props.systemControl({ cardinalOpen: true });
                }
            },
            { divider: true }
        ];

        // Recently used apps
        contextMenu.push({ title: R.get("RECENTLY_USED_APPS"), isTitle: true });
        contextMenu.push({ title: R.get("NONE"), isTitle: true });
        contextMenu.push({ divider: true });

        contextMenu.push({
            title: R.get("LOGOUT_WITH_NAME", { user: this.props.user.nickname }),
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
                emptyMenuText={R.get("EMPTY_MENU")}
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
                    R.get("FILE_UPLOADING", {
                        key: "DESKTOP_UPLOAD"
                    })
                );
            },
            (err, res) => {
                if (err) {
                    this.props.throwMsg(
                        R.get("SERVER_ERROR", {
                            key: "DESKTOP_UPLOAD",
                            ...err
                        })
                    );
                } else {
                    this.props.throwMsg(
                        R.get("FILE_UPLOADED", {
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
    return bindActionCreators({ throwMsg, logout, activateWindow, systemControl }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Desktop);

Desktop.propTypes = {
    user: PropTypes.object,
    system: PropTypes.object,
    throwMsg: PropTypes.func,
    logout: PropTypes.func,
    activateWindow: PropTypes.func,
    systemControl: PropTypes.func
};
