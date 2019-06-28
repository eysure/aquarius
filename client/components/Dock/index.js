import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import FlipMove from "react-flip-move";

import { getAppName } from "../../app_utils";

import { appLaunch, appClose, appConfig, launchPadControl, appWindowActivate } from "../../actions";

import DockItem from "./dock_item";

class Dock extends React.Component {
    render() {
        return (
            <div id="dock-container" style={{ transform: this.props.system.dockHide ? "translate(0,80px)" : "translate(0,0)" }}>
                <FlipMove
                    id="dock"
                    appearAnimation={null}
                    enterAnimation={null}
                    leaveAnimation={null}
                    onContextMenu={this.onContextMenu}
                    style={{ width: (this.props.apps.length + 1) * 72 }}
                >
                    <DockItem
                        id="di-launchpad"
                        key="launchpad"
                        img="/assets/apps/rocket.svg"
                        title="Launchpad"
                        onClick={e => this.props.launchPadControl(!this.props.system.launchpadStatus)}
                    />
                    {this.renderDockItems()}
                </FlipMove>
            </div>
        );
    }

    renderDockItems() {
        return _.map(this.props.apps, app => {
            return <AppDockItem key={app.key} app={app} />;
        });
    }

    onContextMenu = e => {
        e.preventDefault();
        // Context menu
    };
}

const AppDockItem = connect(
    null,
    dispatch => bindActionCreators({ appClose, appWindowActivate, appConfig }, dispatch)
)(
    class extends React.Component {
        render() {
            let app = this.props.app;
            return (
                <DockItem
                    id={"di-" + app.key}
                    key={app.key}
                    onClick={this.handleAppDockItemClick}
                    title={getAppName(app.key)}
                    img={app.appStaticProps.icon}
                    open={app.isActive}
                />
            );
        }

        handleAppDockItemClick = e => {
            let app = this.props.app;
            if (app.status === 2) {
                this.props.appConfig(app.key, { status: 1 }); // Make the window to the normal size
            } else this.props.appWindowActivate(app.key);
        };
    }
);

function mapStateToProps(state) {
    return {
        apps: state.apps,
        user: state.user,
        system: state.system
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ appLaunch, appClose, appConfig, launchPadControl }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dock);
