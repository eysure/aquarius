import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import clientConfig from "../../client_config.js";
import PI from "../../components/panel_item";
import _ from "lodash";
import Avatar from "../../components/user_avatar";

import { ResourceFeeder } from "../../resources_feeder";

import Window from "../../components/dialog";
import { R } from "../../resources_feeder";

class Contacts extends Component {
    static appStaticProps = {
        appName: ["Contacts", "联系人"],
        icon: "/assets/apps/contacts.svg"
    };

    computeOrganization = employee => {
        let { db } = this.props;

        let assign = _.find(db.employees_assign, { user_id: employee._id });
        let { group_id, job_title_id, job_type } = assign;
        let jobTitle = _.find(db.job_title, { _id: job_title_id });
        let group = _.find(db.depts_groups, { _id: group_id });

        let dept = _.find(db.depts, { _id: group.dept_id });
        return { deptName: R.Str(dept.name), groupName: R.Str(group.name), jobTitle: R.Str(jobTitle.name), job_type };
    };

    renderList = () => {
        let employees = this.props.db.employees;
        return _.map(employees, employee => {
            // Compute employee's department
            let { deptName, groupName, jobTitle, job_type } = this.computeOrganization(employee);

            return (
                <React.Fragment key={employee._id}>
                    <PI
                        title={
                            <React.Fragment>
                                <Avatar user={employee} d={32} style={{ marginRight: "8px" }} /> {" " + (employee.name_cn || employee.fn_en)}
                            </React.Fragment>
                        }
                        value={employee.nickname}
                        span={3}
                    />
                    <PI title={jobTitle} span={3} />
                    <PI
                        title={employee.email}
                        span={3}
                        onClick={() => {
                            window.location = `mailto:${employee.email}`;
                        }}
                    />
                    <PI
                        className="monospace"
                        title={employee.mobile}
                        span={2}
                        onClick={() => {
                            window.location = `tel:${employee.mobile}`;
                        }}
                    />
                    <PI className="monospace" title={employee.ext} span={1} />
                </React.Fragment>
            );
        });
    };

    render() {
        return (
            <Window appProps={this.props.appProps} width={1000} height={800} toolbar={this.toolbar}>
                <div className="panel-container">
                    <div className="panel-container-inner" style={{ maxWidth: 1600 }}>
                        <div className="panel" style={{ gridColumnGap: 0 }}>
                            <PI title={R.Str("NAME")} value={R.Str("NICKNAME")} span={3} />
                            <PI title={R.Str("JOB_TITLE")} span={3} />
                            <PI title={R.Str("EMAIL")} span={3} />
                            <PI title={R.Str("MOBILE")} span={2} />
                            <PI title={R.Str("EXT")} span={1} />
                            {this.renderList()}
                        </div>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Contacts);
