import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import * as AQUI from "../../components/Window/core";
import Avatar from "../../components/user_avatar";

import Window from "../../components/Window";

import { ResourceFeeder } from "../../resources_feeder";

import { computeJobInfo } from "../../utils";

import { getAppName } from "../../app_utils.js";

const R = new ResourceFeeder(require("./resources/strings").default, null);

class Contacts extends Component {
    state = { open: true };

    renderList = () => {
        let employees = this.props.db.employees;
        return _.map(employees, employee => {
            // Compute employee's department
            let jobInfo = computeJobInfo(employee._id, this.props.db);
            if (!jobInfo || jobInfo.length === 0) return null;
            jobInfo = jobInfo[0];
            let { deptName, groupName, jobTitle, jobType } = jobInfo;

            return (
                <React.Fragment key={employee._id}>
                    <AQUI.PanelItem
                        title={
                            <React.Fragment>
                                <Avatar user={employee} d={32} style={{ marginRight: "8px" }} /> {" " + (employee.name_cn || employee.fn_en)}
                            </React.Fragment>
                        }
                        value={employee.nickname}
                        span={3}
                    />
                    <AQUI.PanelItem title={jobTitle} span={3} />
                    <AQUI.PanelItem
                        title={employee.email}
                        span={3}
                        onClick={() => {
                            window.location = `mailto:${employee.email}`;
                        }}
                    />
                    <AQUI.PanelItem
                        className="monospace"
                        title={employee.mobile}
                        span={2}
                        onClick={() => {
                            window.location = `tel:${employee.mobile}`;
                        }}
                    />
                    <AQUI.PanelItem className="monospace" title={employee.ext} span={1} />
                </React.Fragment>
            );
        });
    };

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                key="Main"
                _key="Main"
                width={900}
                height={600}
                appKey={this.props.appKey}
                title={getAppName("trumode.contacts", this.props.user)}
                toolbar={this.toolbar}
                onClose={e => this.setState({ open: false })}
            >
                <div className="window-content-inner" style={{ maxWidth: 1600 }}>
                    <div className="panel" style={{ gridColumnGap: 0 }}>
                        <AQUI.PanelItem title={R.get("NAME")} value={R.get("NICKNAME")} span={3} />
                        <AQUI.PanelItem title={R.get("JOB_TITLE")} span={3} />
                        <AQUI.PanelItem title={R.get("EMAIL")} span={3} />
                        <AQUI.PanelItem title={R.get("MOBILE")} span={2} />
                        <AQUI.PanelItem title={R.get("EXT")} span={1} />
                        {this.renderList()}
                    </div>
                </div>
            </Window>
        );
    }

    toolbar = (
        <div className="toolbar-icon">
            <button className="unhandle" disabled>
                <i className="material-icons">print</i>
            </button>
            <button className="unhandle" disabled>
                <i className="material-icons">save_alt</i>
            </button>
        </div>
    );
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
    return {
        db: state.db
    };
}

Contacts.manifest = {
    appKey: "trumode.contacts",
    appName: R.get("APP_NAME"),
    icon: "/assets/apps/contacts.svg"
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Contacts);
