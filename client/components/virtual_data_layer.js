/*
    Note: This class is created for React to lively load data from Meteor at the beginning of the initialization.
*/
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { getLocalCollection } from "../utils";
import _ from "lodash";

import * as Action from "../actions";

class VirtualDataLayer extends React.Component {
    subscribeAndRun = (pubName, callback) => {
        Tracker.autorun(() => {
            Meteor.subscribe(pubName);
            callback();
        });
    };

    /**
     * Subscribe to a Meteor Publisher
     * and bind the related update collection to reducer storage
     */
    subscribeAndBind = (pubName, collections, callback = null) => {
        this.subscribeAndRun(pubName, () => {
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
            if (callback) callback();
        });
    };

    // Update the auth
    updateAuth = () => {
        Meteor.call("getAuth", (err, result) => {
            if (!_.isEqual(result, this.props.auth)) {
                this.props.bindAuth(result);
            }
        });
    };

    componentDidMount() {
        this.subscribeAndBind("myEmployeeInfo", "employees", () => {
            this.updateAuth();
        });
        this.subscribeAndBind("allEmployeesBasicInfo", "employees");
        this.subscribeAndBind("allEmployeesAssign", "employees_assign", () => {
            this.updateAuth();
        });
        this.subscribeAndBind("deptsInfo", "depts", () => {
            this.updateAuth();
        });
        this.subscribeAndBind("groupsInfo", "depts_groups", () => {
            this.updateAuth();
        });
        this.subscribeAndBind("jobTitleInfo", "job_title");
    }

    render() {
        return null;
    }
}

mapStateToProps = state => {
    return {
        db: state.db,
        user: state.user
    };
};

export default connect(
    mapStateToProps,
    dispatch => {
        return bindActionCreators(Action, dispatch);
    }
)(VirtualDataLayer);
