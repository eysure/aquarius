import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import Str from "./string_component";
import { appLaunch, launchPadControl } from "../actions";
import AppMenuItem from "./app_menu_item";

class DesktopContextMenu extends Component {
    render() {
        return (
            <div id="desktop-context-menu" style={{ pointerEvents: "all", zIndex: 1400 }} onClick={this.props.onClose} onBlur={this.props.onCLose}>
                <UI.ListItem button onClick={e => this.props.launchPadControl(true)}>
                    <UI.ListItemIcon>
                        <i className="material-icons">view_comfy</i>
                    </UI.ListItemIcon>
                    <UI.ListItemText primary={<Str LAUNCHPAD />} />
                </UI.ListItem>
                <UI.Divider />
                <AppMenuItem appKey="preference" tabKey="desktop" />
                <UI.Divider />
                <AppMenuItem appKey="debugger" />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            appLaunch,
            launchPadControl
        },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DesktopContextMenu);
