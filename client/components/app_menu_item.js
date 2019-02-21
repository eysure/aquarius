import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import { appLaunch } from "../actions";
import * as AppUtils from "../app_utils";

class AppMenuItem extends Component {
    render() {
        let { appKey, tabKey } = this.props;

        if (!appKey) {
            console.error("No appKey provide to AppMenuItem.");
            return <UI.MenuItem />;
        }

        return (
            <UI.MenuItem
                onClick={() => {
                    this.props.appLaunch(appKey, {
                        openWithTab: tabKey,
                        ...this.props.option
                    });
                }}
            >
                <UI.ListItemIcon>
                    {tabKey
                        ? AppUtils.getTabIcon(
                              appKey,
                              tabKey,
                              this.props.user,
                              24
                          )
                        : AppUtils.getAppIcon(appKey, this.props.user, 24)}
                </UI.ListItemIcon>
                <UI.ListItemText>
                    {tabKey
                        ? AppUtils.getTabName(appKey, tabKey, this.props.user)
                        : AppUtils.getAppName(appKey, this.props.user)}
                </UI.ListItemText>
            </UI.MenuItem>
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
)(AppMenuItem);
