import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { appClose, throwMsg } from "../actions";
import { getAppWithKey } from "../app_utils";
import Application from "./Application";
import { R } from "../resources_feeder";
import { Meteor } from "meteor/meteor";

import PropTypes from "prop-types";

class AppHost extends Component {
    render() {
        if (!Meteor.userId()) return "";

        const apps = _.map(this.props.apps, app => {
            try {
                if (app.status >= 1) {
                    let appClass = getAppWithKey(app.appKey);
                    if (!appClass) {
                        this.props.throwMsg(
                            R.get("APP_LAUNCH_FAILED", {
                                msgContent: "No appKey found in appList." + app.appKey
                            })
                        );
                        this.props.appClose(app.appKey);
                    }

                    // Let React to inflate the app
                    let appInstance = React.createElement(appClass, {
                        manifest: appClass.manifest,
                        appKey: app.appKey,
                        isActive: app.isActive,
                        option: app.option,
                        status: app.status
                    });

                    return (
                        <Application key={app.appKey} app={app} windows={this.props.windows[app.appKey]}>
                            {appInstance}
                        </Application>
                    );
                }
            } catch (e) {
                console.error(e);
            }
        });

        return (
            <div
                id="app-host"
                className="first-class-overlap"
                style={{
                    height: `calc(100% - ${this.props.system.menuBarHide ? "0px" : "24px"})`,
                    transition: "300ms"
                }}
            >
                <div id="bottom-group" />
                <div id="low-group" />
                <div id="normal-group" />
                <div id="high-group" />
                <div id="top-group" />
                {apps}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        apps: state.apps,
        system: state.system,
        windows: state.windows,
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg, appClose }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHost);

AppHost.propTypes = {
    apps: PropTypes.object.isRequired,
    system: PropTypes.object.isRequired,
    windows: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    throwMsg: PropTypes.func.isRequired,
    appClose: PropTypes.func.isRequired
};
