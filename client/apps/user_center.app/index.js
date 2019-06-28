import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";

import * as UI from "@material-ui/core";
import Window from "../../components/dialog";

import { Meteor } from "meteor/meteor";
import { logout, throwMsg } from "../../actions";
import AccountSecurityTab from "./tab_account_security";
import { ResourceFeeder } from "../../resources_feeder";
import Avatar from "../../components/user_avatar";
import PI from "../../components/panel_item";
import DropFile from "../../components/DropFile";
import { fileUploadVerify, upload, oss, getLocalCollection } from "../../utils";

export const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));

const TAB_BASIC_INFO = "TAB_BASIC_INFO";
const TAB_ACCOUNT_SECURITY = "TAB_ACCOUNT_SECURITY";

class UserCenter extends Component {
    static appStaticProps = {
        appName: ["User Center", "个人中心"],
        icon: "/assets/apps/id.svg"
    };

    state = {
        selectedTab: TAB_BASIC_INFO
    };

    jobTypeCircleStyle = {
        color: "grey",
        margin: 4,
        fontSize: "1.2em"
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

    getJobType(jobTypeCode) {
        switch (jobTypeCode) {
            // Pause
            case -1:
                return [R.Str("PAUSE"), <UI.Icon style={this.jobTypeCircleStyle}>pause_circle_filled</UI.Icon>];
            case 0:
                return [R.Str("INTERNSHIP"), <UI.Icon style={this.jobTypeCircleStyle}>school</UI.Icon>];
            case 1:
                return [R.Str("PROBATION"), <UI.Icon style={this.jobTypeCircleStyle}>schedule</UI.Icon>];
            case 2:
                return [R.Str("FULL_TIME"), <UI.Icon style={this.jobTypeCircleStyle}>check_circle</UI.Icon>];
            case 3:
                return [R.Str("PART_TIME"), <UI.Icon style={this.jobTypeCircleStyle}>timelapse</UI.Icon>];
            default:
                return [R.Str("INVALID_JOB_TYPE"), <UI.Icon style={this.jobTypeCircleStyle}>error</UI.Icon>];
        }
    }

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

    userAvatarCircleStyle = {
        width: 120,
        height: 120
    };

    userAvatarImageStyle = {
        height: "100%",
        width: "100%",
        objectFit: "contain"
    };

    renderOrg = orgs => {
        _.map(orgs, org => {
            return (
                <div style={this.userSectionStyle} key={org.dept_id + "_" + org.group_id + "_" + org.job_title_id}>
                    <div style={this.userJobStyle}>
                        {getLanguage(this.props.user) ? org.dept_name_cn : org.dept_name_en}
                        {org.group_name_en ? <UI.Icon style={{ fontSize: 20 }}>arrow_right</UI.Icon> : null}
                        {getLanguage(this.props.user) ? org.group_name_cn : org.group_name_en}
                        <UI.Icon style={{ fontSize: 20 }}>arrow_right</UI.Icon>
                        {getLanguage(this.props.user) ? org.job_title_cn : org.job_title_en}
                        <UI.Tooltip title={this.getJobType(org.job_type)[0]}>{this.getJobType(org.job_type)[1]}</UI.Tooltip>
                    </div>
                </div>
            );
        });
    };

    render() {
        return (
            <Window appProps={this.props.appProps} width={960} height={720} titleBarStyle="fusion">
                <div className="handle" style={this.sidebarStyle}>
                    <div style={{ height: "36px", outline: "none" }} />
                    <div>
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
                    <UI.Divider style={{ margin: "0 16px 0 16px" }} />
                    <UI.MenuList className="unhandle">
                        <UI.ListItem button selected={this.state.selectedTab === TAB_BASIC_INFO} onClick={e => this.setState({ selectedTab: TAB_BASIC_INFO })}>
                            <i className="material-icons">assignment_ind</i>
                            <UI.ListItemText primary={R.Str("BASIC_INFO")} />
                        </UI.ListItem>
                        <UI.ListItem
                            button
                            selected={this.state.selectedTab === TAB_ACCOUNT_SECURITY}
                            onClick={() =>
                                this.setState({
                                    selectedTab: TAB_ACCOUNT_SECURITY
                                })
                            }
                        >
                            <i className="material-icons">vpn_key</i>
                            <UI.ListItemText primary={R.Str("ACCOUNT_SECURITY")} />
                        </UI.ListItem>
                    </UI.MenuList>
                </div>
                <div style={this.sidebarContentStyle}>
                    <div className="panel-container">{this.renderContent()}</div>
                </div>
            </Window>
        );
    }

    handleAvatarUpload = e => {
        let file = e[0];
        if (!fileUploadVerify(file, this.props.throwMsg, R).result) return;

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

    renderContent() {
        switch (this.state.selectedTab) {
            default:
            case TAB_BASIC_INFO:
                return this.renderBasicInfoPage();
            case TAB_ACCOUNT_SECURITY:
                return <AccountSecurityTab />;
        }
    }

    renderBasicInfoPage() {
        return (
            <div className="panel-container-inner">
                <div className="panel-title">{R.Str("BASIC_INFO")}</div>
                <div className="panel">
                    <PI title={R.Str("ENG_FN")} value={this.props.user.fn_en} span={4} />
                    <PI title={R.Str("ENG_MN")} value={this.props.user.mn_en} span={4} />
                    <PI title={R.Str("ENG_LN")} value={this.props.user.ln_en} span={4} />
                    <PI title={R.Str("EMAIL")} value={this.props.user.email} />
                    <PI title={R.Str("NICKNAME")} value={this.props.user.nickname} />
                    <PI title={R.Str("MOBILE")} value={this.props.user.mobile} />
                    <PI title={R.Str("EXT")} value={this.props.user.ext} />
                </div>

                <div className="panel-title">{R.Str("JOB_INFO")}</div>
                <div className="panel">
                    <PI title={R.Str("DEPARTMENT")} />
                    <PI title={R.Str("GROUP")} />
                    <PI title={R.Str("JOB_TITLE")} />
                    <PI title={R.Str("JOB_TYPE")} span={6} />
                    <PI title={R.Str("TIME_START")} span={6} />
                </div>

                <div className="panel-title">{R.Str("HISTORY_JOB_INFO")}</div>
                <div className="panel">
                    <PI title={R.Str("SEE_HISTORY_JOB_INFO")} button value={<i className="material-icons">open_in_new</i>} />
                </div>
            </div>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserCenter);
