import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import * as UI from "@material-ui/core";
import { Meteor } from "meteor/meteor";

import { logout, throwMsg } from "../../actions";
import { upload, fileUploadVerify } from "../../utils";
import { ResourceFeeder } from "../../resources_feeder";

import AccountBasicTab from "./tab_account_basic";
import AccountSecurityTab from "./tab_account_security";
import AccountAdvancedTab from "./tab_account_advanced";

import Avatar from "../../components/user_avatar";
import DropFile from "../../components/DropFile";
import Window from "../../components/Window";

export const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));

const TAB_ACCOUNT_BASIC = "TAB_ACCOUNT_BASIC";
const TAB_ACCOUNT_SECURITY = "TAB_ACCOUNT_SECURITY";
const TAB_ACCOUNT_ADVANCED = "TAB_ACCOUNT_ADVANCED";

class UserCenter extends Component {
    state = {
        selectedTab: TAB_ACCOUNT_BASIC
    };

    userAvatarStyle = {
        display: "flex",
        justifyContent: "center",
        margin: "13px auto",
        width: "fit-content",
        borderRadius: "50%",
        overflow: "hidden"
    };

    userSectionStyle = {
        display: "flex",
        justifyContent: "center"
    };

    tabs = {
        TAB_ACCOUNT_BASIC: { name: TAB_ACCOUNT_BASIC, icon: "assignment_ind", tab: <AccountBasicTab /> },
        TAB_ACCOUNT_ADVANCED: { name: TAB_ACCOUNT_ADVANCED, icon: "font_download", tab: <AccountAdvancedTab /> }
    };

    handleAvatarUpload = e => {
        let file = e[0];
        if (!fileUploadVerify(file, this.props.throwMsg).result) return;

        upload(
            file,
            "uploadAvatar",
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
                            avatar: res,
                            email: employee.email,
                            desktop: _.get(employee, "preferences.desktop", "default.jpg")
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

    renderTabList = tabs => {
        return Object.entries(tabs).map(tab => {
            return (
                <UI.ListItem key={tab[1].name} button selected={this.state.selectedTab === tab[0]} onClick={e => this.setState({ selectedTab: tab[0] })}>
                    <i className="material-icons">{tab[1].icon}</i>
                    <UI.ListItemText primary={R.Str(tab[1].name)} />
                </UI.ListItem>
            );
        });
    };

    renderContent = tabs => {
        return tabs[this.state.selectedTab].tab;
    };

    render() {
        if (_.get(this.props.auth, "change_password")) {
            this.tabs[TAB_ACCOUNT_SECURITY] = { name: TAB_ACCOUNT_SECURITY, icon: "vpn_key", tab: <AccountSecurityTab /> };
        }

        return (
            <Window key="Main" _key="Main" width={960} height={720} appKey={this.props.appKey} theme="light">
                <div className="window-sidebar-container">
                    <div className="window-sidebar">
                        <div className="user-center-sidebar-user-section">
                            <DropFile handleDrop={this.handleAvatarUpload} style={this.userAvatarStyle} clickToSelect>
                                <Avatar user={this.props.user} d={120} />
                            </DropFile>
                            <div style={this.userSectionStyle}>
                                <UI.Typography variant="subheading">{this.props.user.nickname}</UI.Typography>
                            </div>
                            <div style={this.userSectionStyle}>
                                <UI.Typography variant="caption">{this.props.user.email}</UI.Typography>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    justifyContent: "center",
                                    padding: 8
                                }}
                            >
                                <UI.Button
                                    className="unhandle"
                                    size="small"
                                    color="secondary"
                                    onClick={() => {
                                        Meteor.logout(error => this.props.logout(error));
                                    }}
                                >
                                    {R.Str("LOGOUT")}
                                </UI.Button>
                            </div>
                        </div>
                        <UI.MenuList>{this.renderTabList(this.tabs)}</UI.MenuList>
                    </div>
                    <div className="window-sidebar-content">{this.renderContent(this.tabs)}</div>
                </div>
            </Window>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ logout, throwMsg }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.user,
        auth: state.auth
    };
}

UserCenter.manifest = {
    appKey: "user_center",
    appName: ["User Center", "个人中心"],
    icon: "/assets/apps/id.svg"
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserCenter);
