/*
    Note: This class is created for React to load data from Meteor at the beginning of the initialization.
*/

import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { getLocalCollection } from "../utils";

import * as Action from "../actions";

class VirtualDataLayer extends React.Component {
    componentDidMount() {
        Tracker.autorun(() => {
            let start = window.performance.now();
            Meteor.subscribe("myEmployeeInfo");
            this.props.bindCollection(
                "employees",
                getLocalCollection("employees")
                    .find()
                    .fetch()
            );
            console.warn("myEmployeeInfo: " + (window.performance.now() - start).toFixed(2) + " ms");
        });
        Tracker.autorun(() => {
            let start = window.performance.now();
            Meteor.subscribe("allEmployeesInfo");
            this.props.bindCollection(
                "employees",
                getLocalCollection("employees")
                    .find()
                    .fetch()
            );
            this.props.bindCollection(
                "employees_assign",
                getLocalCollection("employees_assign")
                    .find()
                    .fetch()
            );
            this.props.bindCollection(
                "depts",
                getLocalCollection("depts")
                    .find()
                    .fetch()
            );
            this.props.bindCollection(
                "depts_groups",
                getLocalCollection("depts_groups")
                    .find()
                    .fetch()
            );
            this.props.bindCollection(
                "job_title",
                getLocalCollection("job_title")
                    .find()
                    .fetch()
            );
            console.warn("allEmployeesInfo: " + (window.performance.now() - start).toFixed(2) + " ms");
        });
    }

    render() {
        return null;
    }
}

export default connect(
    state => {
        return state;
    },
    dispatch => {
        return bindActionCreators(Action, dispatch);
    }
)(VirtualDataLayer);
