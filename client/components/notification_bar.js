import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Notif from "./notification";
import FlipMove from "react-flip-move";
import { closeMsg } from "../actions";
import _ from "lodash";

class NotificationBar extends Component {
    render() {
        return (
            <FlipMove
                id="notification-bar"
                appearAnimation={{
                    from: {
                        transform: "translateX(calc(100% + 32px))",
                        opacity: 0.1
                    },
                    to: {
                        transform: "",
                        opacity: 1
                    },
                    easing: "ease-out"
                }}
                enterAnimation={{
                    from: {
                        transform: "translateX(calc(100% + 32px))",
                        opacity: 0.1
                    },
                    to: {
                        transform: "",
                        opacity: 1
                    },
                    easing: "ease-out"
                }}
                leaveAnimation={{
                    from: {
                        transform: "",
                        opacity: 1
                    },
                    to: {
                        transform: "translateX(calc(100% + 32px))",
                        opacity: 0.1
                    },
                    easing: "ease-in"
                }}
                duration={300}
                style={{
                    position: "absolute",
                    padding: 32,
                    paddingTop: 68,
                    right: 0,
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    transition: "300ms all",
                    pointerEvents: "none",
                    zIndex: 1800
                }}
            >
                {this.renderNotifications()}
            </FlipMove>
        );
    }

    renderNotifications() {
        return _.map(this.props.notifications, notif => {
            if (notif.new) {
                return <Notif key={notif.key} _key={notif.key} {...notif} closeMsg={this.props.closeMsg} />;
            }
        });
    }
}

function mapStateToProps(state) {
    return {
        notifications: state.notifications,
        user: state.user,
        system: state.system
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ closeMsg }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationBar);
