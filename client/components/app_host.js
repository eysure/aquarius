import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import SwipeableViews from "react-swipeable-views";
import { appClose, throwMsg } from "../actions";
import { getAppWithKey } from "../app_utils";
import AppShell from "./app_shell";
import { R } from "../resources_feeder";

class AppHost extends Component {
    render() {
        if (!Meteor.userId()) return "";

        const apps = _.map(this.props.apps, appInState => {
            try {
                if (appInState.status >= 1) {
                    let thisApp = getAppWithKey(appInState.key);
                    if (!thisApp) {
                        this.props.throwMsg(
                            R.Msg("APP_LAUNCH_FAILED", {
                                msgContent:
                                    "No appKey found in appList." +
                                    appInState.key
                            })
                        );
                        this.props.appClose(appInState.key);
                    }

                    return (
                        <AppShell key={appInState.key}>
                            {React.createElement(thisApp, {
                                key: appInState.key,
                                appProps: {
                                    appStaticProps: thisApp.appStaticProps,
                                    key: appInState.key,
                                    isActive: appInState.isActive,
                                    option: appInState.option,
                                    status: appInState.status
                                },
                                onClose: () => {
                                    this.props.appClose(appInState.key);
                                }
                            })}
                        </AppShell>
                    );
                }
            } catch (e) {
                console.log(e);
            }
        });

        return (
            <div
                id="app-host"
                className="first-class-overlap"
                style={{
                    height: `calc(100% - ${
                        this.props.system.menuBarHide ? "0px" : "36px"
                    })`,
                    transition: "300ms"
                }}
            >
                {apps}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        apps: state.apps,
        system: state.system
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg, appClose }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHost);
