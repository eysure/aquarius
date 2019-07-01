import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";

import * as UI from "@material-ui/core";

import { Meteor } from "meteor/meteor";
import { logout, throwMsg } from "../../actions";

import AccountBasicTab from "./tab_account_basic";
import AccountSecurityTab from "./tab_account_security";
import AccountAdvancedTab from "./tab_account_advanced";

import { ResourceFeeder } from "../../resources_feeder";
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

    sidebarStyle = {
        position: "absolute",
        boxSizing: "border-box",
        borderRight: "1px solid #d6d4d3",
        borderRadius: "6px 0 0 6px",
        height: "100%",
        overflow: "auto",
        width: "220px"
    };

    sidebarContentStyle = {
        position: "absolute",
        left: "220px",
        background: "#E0E0E0",
        borderTopRightRadius: "6px",
        borderBottomRightRadius: "6px",
        width: "calc(100% - 220px)",
        height: "100%",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
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

    userJobStyle = {
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center",
        margin: 4,
        fontSize: 0.7 + "em",
        border: "1px solid darkgrey",
        borderRadius: 8,
        alignItems: "center",
        padding: "4px 8px"
    };

    userAvatarImageStyle = {
        height: "100%",
        width: "100%",
        objectFit: "contain"
    };

    tabs = {
        TAB_ACCOUNT_BASIC: { name: TAB_ACCOUNT_BASIC, icon: "assignment_ind", tab: <AccountBasicTab /> },
        TAB_ACCOUNT_SECURITY: { name: TAB_ACCOUNT_SECURITY, icon: "vpn_key", tab: <AccountSecurityTab /> },
        TAB_ACCOUNT_ADVANCED: { name: TAB_ACCOUNT_ADVANCED, icon: "font_download", tab: <AccountAdvancedTab /> }
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
        return (
            <Window key="Main" _key="Main" width={960} height={720} appKey={this.props.appKey}>
                <div className="user-center-sidebar handle" style={this.sidebarStyle}>
                    <div className="user-center-sidebar-user-section" style={{ marginTop: 50 }}>
                        <DropFile className="drop-file-click" handleDrop={this.handleAvatarUpload} style={this.userAvatarStyle} clickToSelect>
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
                    <UI.MenuList className="unhandle">{this.renderTabList(this.tabs)}</UI.MenuList>
                </div>
                <div style={this.sidebarContentStyle}>
                    <div className="panel-container">{this.renderContent(this.tabs)}</div>
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
        user: state.user
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
