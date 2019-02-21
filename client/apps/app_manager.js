import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import Str from "../components/string_component";
import { getAppName } from "../app_utils";
import _ from "lodash";

import { appClose, appWindowActivate } from "../actions";

import Window from "../components/dialog";

class AppManager extends Component {
    static appStaticProps = {
        appName: ["App Manager", "应用管理器"],
        icon: "/assets/apps/storyboard.svg",
        defaultOption: {
            alwaysOnFront: true
        }
    };

    render() {
        return (
            <Window appProps={this.props.appProps} width={360}>
                <UI.DialogContent className="no-padding">
                    <UI.List
                        component="nav"
                        subheader={
                            <UI.ListSubheader component="div">
                                {this.props.apps.length} app(s) running
                            </UI.ListSubheader>
                        }
                    >
                        {this.renderAppList()}
                    </UI.List>
                </UI.DialogContent>
            </Window>
        );
    }

    renderAppList() {
        return _.map(this.props.apps, app => {
            let appStaticProps = app.appStaticProps;

            return (
                <UI.ListItem
                    button
                    key={app.key}
                    onClick={() => {
                        this.props.appWindowActivate(app.key, app.option);
                    }}
                >
                    <UI.ListItemIcon>
                        {appStaticProps.materialIcon ? (
                            <UI.Avatar>
                                <UI.Icon>{appStaticProps.icon}</UI.Icon>
                            </UI.Avatar>
                        ) : (
                            <img
                                style={{ width: "40px", height: "40px" }}
                                alt={getAppName(app.key, this.props.user)}
                                src={appStaticProps.icon}
                            />
                        )}
                    </UI.ListItemIcon>
                    <UI.ListItemText
                        primary={getAppName(app.key, this.props.user)}
                        secondary={
                            app.key +
                            " : " +
                            app.status +
                            (app.isActive ? " active" : " inactive")
                        }
                    />
                    <UI.ListItemSecondaryAction>
                        {_.get(app, "option.isSystem", false) ? (
                            ""
                        ) : (
                            <UI.IconButton
                                aria-label="close this App"
                                onClick={() => {
                                    this.props.appClose(app.key);
                                }}
                            >
                                <UI.Icon>close</UI.Icon>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppManager);
