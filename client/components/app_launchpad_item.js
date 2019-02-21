import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import { appLaunch } from "../actions";
import * as AppUtils from "../app_utils";
import LaunchpadItem from "./launchpad_item";

const materialLaunchpadIconStyle = {
    fontSize: "8vmin",
    background: "#F5F5F5",
    color: "#444",
    borderRadius: "50%",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    filter: "drop-shadow(0 0.4vmin 0.5vmin rgba(0,0,0,0.4))",
    transform: "scale(0.9)"
};

class AppLaunchpadItem extends Component {
    render() {
        let { appKey, badge } = this.props;

        if (!appKey) {
            console.error("No appKey provide to AppMenuItem.");
            return (
                <LaunchpadItem
                    icon="/assets/apps/default.png"
                    title="No AppKey"
                />
            );
        }

        return (
            <LaunchpadItem
                icon={AppUtils.getAppIcon(
                    appKey,
                    this.props.user,
                    "9vmin",
                    materialLaunchpadIconStyle
                )}
                title={AppUtils.getAppName(appKey, this.props.user)}
                badge={badge}
                onClick={() => {
                    this.props.appLaunch(appKey, {
                        ...this.props.option
                    });
                }}
                {...this.props}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            appLaunch
        },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppLaunchpadItem);
