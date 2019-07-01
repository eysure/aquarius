import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import FlipMove from "react-flip-move";

import { getAppName } from "../../app_utils";

import { appLaunch, appClose, appConfig, launchPadControl, appWindowActivate } from "../../actions";

import DockItem from "./dock_item";
import { WINDOW_STATUS_MIN, WINDOW_STATUS_NORMAL } from "../Window";

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
                    style={{ width: (Object.keys(this.props.apps).length + 1) * 72 }}
                >
                    <DockItem
                        id="di-launchpad"
                        key="launchpad"
                        img="/assets/apps/rocket.svg"
                        title="Launchpad"
                        onClick={() => this.props.launchPadControl(!this.props.system.launchpadStatus)}
                    />
                    {this.renderDockItems()}
                </FlipMove>
            </div>
        );
    }

    renderDockItems() {
        return _.map(this.props.apps, app => {
            return (
                <DockItem
                    id={"di-" + app.appKey}
                    key={app.appKey}
                    onClick={() => this.handleDockItemClick(app)}
                    title={getAppName(app.appKey, this.props.user)}
                    img={app.manifest.icon}
                    open={app.isActive}
                />
            );
        });
    }

    handleDockItemClick = app => {
        if (app.status === WINDOW_STATUS_MIN) {
            this.props.appConfig(app.appKey, { status: WINDOW_STATUS_NORMAL }); // Make the window to the normal size
        } else this.props.appWindowActivate(app.appKey);
    };

    onContextMenu = e => {
        e.preventDefault();
        console.log("TODO: Dock context menu");
    };
}

function mapStateToProps(state) {
    return {
        apps: state.apps,
        user: state.user,
        system: state.system
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ appLaunch, appClose, appConfig, launchPadControl, appWindowActivate }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dock);
