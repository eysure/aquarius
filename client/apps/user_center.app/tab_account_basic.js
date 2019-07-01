import React, { Component } from "react";
import PI from "../../components/panel_item";
import { connect } from "react-redux";
import { fileUploadVerify, upload } from "../../utils";

import { R } from "./";

export class AccountBasicTab extends Component {
    // jobTypeCircleStyle = {
    //     color: "grey",
    //     margin: 4,
    //     fontSize: "1.2em"
    // };

    // getJobType(jobTypeCode) {
    //     switch (jobTypeCode) {
    //         // Pause
    //         case -1:
    //             return [R.Str("PAUSE"), <UI.Icon style={this.jobTypeCircleStyle}>pause_circle_filled</UI.Icon>];
    //         case 0:
    //             return [R.Str("INTERNSHIP"), <UI.Icon style={this.jobTypeCircleStyle}>school</UI.Icon>];
    //         case 1:
    //             return [R.Str("PROBATION"), <UI.Icon style={this.jobTypeCircleStyle}>schedule</UI.Icon>];
    //         case 2:
    //             return [R.Str("FULL_TIME"), <UI.Icon style={this.jobTypeCircleStyle}>check_circle</UI.Icon>];
    //         case 3:
    //             return [R.Str("PART_TIME"), <UI.Icon style={this.jobTypeCircleStyle}>timelapse</UI.Icon>];
    //         default:
    //             return [R.Str("INVALID_JOB_TYPE"), <UI.Icon style={this.jobTypeCircleStyle}>error</UI.Icon>];
    //     }
    // }

    // renderOrg = orgs => {
    //     _.map(orgs, org => {
    //         return (
    //             <div style={this.userSectionStyle} key={org.dept_id + "_" + org.group_id + "_" + org.job_title_id}>
    //                 <div style={this.userJobStyle}>
    //                     {getLanguage(this.props.user) ? org.dept_name_cn : org.dept_name_en}
    //                     {org.group_name_en ? <UI.Icon style={{ fontSize: 20 }}>arrow_right</UI.Icon> : null}
    //                     {getLanguage(this.props.user) ? org.group_name_cn : org.group_name_en}
    //                     <UI.Icon style={{ fontSize: 20 }}>arrow_right</UI.Icon>
    //                     {getLanguage(this.props.user) ? org.job_title_cn : org.job_title_en}
    //                     <UI.Tooltip title={this.getJobType(org.job_type)[0]}>{this.getJobType(org.job_type)[1]}</UI.Tooltip>
    //                 </div>
    //             </div>
    //         );
    //     });
    // };

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

    render() {
        return (
            <div className="panel-container-inner">
                <div className="panel-title">{R.Str("TAB_ACCOUNT_BASIC")}</div>
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

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountBasicTab);
