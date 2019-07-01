/*
    Note: This class is created for React to lively load data from Meteor at the beginning of the initialization.
*/
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { getLocalCollection } from "../utils";

import * as Action from "../actions";

Meteor.subscribe("myEmployeeInfo");
// Meteor.subscribe("allEmployeesInfo");

class VirtualDataLayer extends React.Component {
    /**
     * Subscribe to a Meteor Publisher
     * and bind the related update collection to reducer storage
     */
    subscribeAndBind = (pubName, collections) => {
        Tracker.autorun(() => {
            Meteor.subscribe(pubName);
            if (collections instanceof Array) {
                for (let collection of collections) {
                    this.props.bindCollection(
                        collection,
                        getLocalCollection(collection)
                            .find()
                            .fetch()
                    );
                }
            } else {
                this.props.bindCollection(
                    collections,
                    getLocalCollection(collections)
                        .find()
                        .fetch()
                );
            }
        });
    };

    componentDidMount() {
        this.subscribeAndBind("myEmployeeInfo", "employees");
        this.subscribeAndBind("allEmployeesBasicInfo", "employees");
        this.subscribeAndBind("allEmployeesAssign", "employees_assign");
        this.subscribeAndBind("deptsInfo", "depts");
        this.subscribeAndBind("groupsInfo", "depts_groups");
        this.subscribeAndBind("jobTitleInfo", "job_title");
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
