import React, { Component } from "react";
import PI from "../../components/panel_item";
import { connect } from "react-redux";
import { fileUploadVerify, upload, computeJobInfo } from "../../utils";
import _ from "lodash";

import { R } from "./";

export class AccountBasicTab extends Component {
    render() {
        return (
            <div className="window-content-inner">
                <div className="panel-title">{R.Str("TAB_ACCOUNT_BASIC")}</div>
                <div className="panel">
                    <PI title={R.Str("EMAIL")} value={this.props.user.email} />
                    <PI title={R.Str("ENG_FN")} value={this.props.user.fname} span={4} />
                    <PI title={R.Str("ENG_MN")} value={this.props.user.mname} span={4} />
                    <PI title={R.Str("ENG_LN")} value={this.props.user.lname} span={4} />
                    <PI title={R.Str("NICKNAME")} value={this.props.user.nickname} />
                    <PI title={R.Str("MOBILE")} value={this.props.user.mobile} />
                    <PI title={R.Str("EXT")} value={this.props.user.ext} />
                </div>

                <div className="panel-title">{R.Str("JOB_INFO")}</div>
                {this.renderJobInfo()}
            </div>
        );
    }

    renderJobInfo = () => {
        let jobs = computeJobInfo(this.props.user._id, this.props.db);
        let index = 0;
        return jobs.map(jobInfo => {
            return (
                <div className="panel" key={`jobInfo ${index++}`}>
                    <PI title={R.Str("DEPARTMENT")} value={jobInfo.deptName} />
                    <PI title={R.Str("GROUP")} value={jobInfo.groupName} />
                    <PI title={R.Str("JOB_TITLE")} value={jobInfo.jobTitle} />
                    <PI title={R.Str("JOB_TYPE")} span={6} value={jobInfo.jobType} />
                    <PI title={R.Str("TIME_START")} span={6} value={jobInfo.startTime && jobInfo.startTime.toLocaleString()} />
                </div>
            );
        });
    };
}

const mapStateToProps = state => ({
    user: state.user,
    db: state.db
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountBasicTab);
