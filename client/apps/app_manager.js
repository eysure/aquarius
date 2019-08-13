import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import { getAppName } from "../app_utils";
import _ from "lodash";
import { ResourceFeeder } from "../resources_feeder";
const R = new ResourceFeeder(null);

import { appClose, appWindowActivate } from "../actions";

import Window, { WINDOW_PRIORITY_TOP } from "../components/Window";

class AppManager extends Component {
    state = { open: true };

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                key="Main"
                _key="Main"
                appKey={this.props.appKey}
                title={R.Trans(AppManager.manifest.appName)}
                windowPriority={WINDOW_PRIORITY_TOP}
                onClose={e => this.setState({ open: false })}
            >
                <UI.DialogContent className="no-padding">
                    <UI.List component="nav" subheader={<UI.ListSubheader component="div">{this.props.apps.length} app(s) running</UI.ListSubheader>}>
                        {this.renderAppList()}
                    </UI.List>
                </UI.DialogContent>
            </Window>
        );
    }

    renderAppList() {
        return _.map(this.props.apps, app => {
            let manifest = app.manifest;

            return (
                <UI.ListItem
                    button
                    key={app.appKey}
                    onClick={() => {
                        this.props.appWindowActivate(app.appKey, app.option);
                    }}
                >
                    <UI.ListItemIcon>
                        {manifest.materialIcon ? (
                            <UI.Avatar>
                                <i className="material-icons">{manifest.icon}</i>
                            </UI.Avatar>
                        ) : (
                            <img style={{ width: "40px", height: "40px" }} alt={getAppName(app.appKey, this.props.user)} src={manifest.icon} />
                        )}
                    </UI.ListItemIcon>
                    <UI.ListItemText
                        primary={getAppName(app.appKey, this.props.user)}
                        secondary={app.appKey + " : " + app.status + (app.isActive ? " active" : " inactive")}
                    />
                    <UI.ListItemSecondaryAction>
                        {_.get(app, "option.isSystem", false) ? (
                            ""
                        ) : (
                            <UI.IconButton
                                aria-label="close this App"
                                onClick={() => {
                                    this.props.appClose(app.appKey);
                                }}
                            >
                                <i className="material-icons">close</i>
                            </UI.IconButton>
                        )}
                    </UI.ListItemSecondaryAction>
                </UI.ListItem>
            );
        });
    }
}

function mapStateToProps(state) {
    return {
        apps: state.apps,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ appClose, appWindowActivate }, dispatch);
}

AppManager.manifest = {
    appKey: "app_manager",
    appName: ["App Manager", "应用管理器"],
    icon: "/assets/apps/storyboard.svg",
    defaultOption: {
        alwaysOnFront: true
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppManager);
