import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { appWindowActivate, appClose, launchPadControl, logout } from "../actions";
import hotkeys from "hotkeys-js";
import { Meteor } from "meteor/meteor";

class HotKeysWrapper extends React.Component {
    render() {
        return this.props.children;
    }

    componentDidMount() {
        // Open Launcher
        hotkeys("cmd+l,ctrl+l,f1", (event, handler) => {
            event.preventDefault();
            this.props.launchPadControl(!this.props.system.launchpadStatus);
        });

        // Logout
        hotkeys("cmd+esc,ctrl+esc", (event, handler) => {
            event.preventDefault();
            Meteor.logout(error => this.props.logout(error));
        });

        // Prevent Save
        hotkeys("ctrl+s,cmd+s", function(event, handler) {
            event.preventDefault();
        });

        // Prevent Print
        hotkeys("ctrl+p,cmd+p", function(event, handler) {
            event.preventDefault();
        });

        // Prevent Print
        hotkeys("ctrl+d,cmd+d", function(event, handler) {
            event.preventDefault();
        });
    }
}

function mapStateToProps(state) {
    return { system: state.system };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ appWindowActivate, appClose, launchPadControl, logout }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HotKeysWrapper);
