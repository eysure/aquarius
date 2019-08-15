import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { activateWindow, appClose, appLaunch, launchPadControl } from "../../actions";
import { getAppName } from "../../app_utils";
import { WINDOW_STATUS_MIN } from "../Window";
import DockItem from "./dock_item";
import PropTypes from "prop-types";

class Dock extends React.Component {
    render() {
        return (
            <div id="dock-container" style={{ transform: this.props.system.dockHide ? "translate(0,80px)" : "translate(0,0)" }}>
                <div id="dock" style={{ width: (Object.keys(this.props.apps).length + 1) * 72 }} onContextMenu={this.onContextMenu}>
                    <DockItem
                        id="di-launchpad"
                        key="launchpad"
                        img="/assets/apps/rocket.svg"
                        title="Launchpad"
                        onClick={() => this.props.launchPadControl(!this.props.system.launchpadStatus)}
                    />
                    {this.renderDockItems()}
                </div>
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
        // If all windows in this app are minimized
        let allMinimized = true;
        const windows = this.props.windows[app.appKey];
        let firstWindow = null;
        for (let windowKey in windows) {
            if (!firstWindow) firstWindow = windows[windowKey];
            allMinimized = allMinimized && windows[windowKey].state.windowStatus === WINDOW_STATUS_MIN;
        }
        if (allMinimized) firstWindow.handleMin();
        else this.props.activateWindow(app.appKey);
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
        system: state.system,
        windows: state.windows
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ appLaunch, appClose, launchPadControl, activateWindow }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dock);

Dock.propTypes = {
    apps: PropTypes.object,
    user: PropTypes.object,
    system: PropTypes.object,
    windows: PropTypes.object,
    appLaunch: PropTypes.func,
    appClose: PropTypes.func,
    launchPadControl: PropTypes.func,
    activateWindow: PropTypes.func
};
