import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Notification from "./notification";
import FlipMove from "react-flip-move";
import { closeMsg } from "../actions";
import _ from "lodash";
import PropTypes from "prop-types";

class NotificationBar extends Component {
    static propTypes = {
        notifications: PropTypes.array.isRequired,
        closeMsg: PropTypes.func
    };

    render() {
        return (
            <FlipMove
                id="notification-bar"
                className="aqui-notif-bar"
                style={{ position: "absolute" }}
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
                duration={200}
            >
                {this.renderNotifications()}
            </FlipMove>
        );
    }

    renderNotifications() {
        return _.map(this.props.notifications, notif => {
            if (notif.new) {
                return <Notification key={notif.key} _key={notif.key} {...notif} closeMsg={this.props.closeMsg} />;
            }
        });
    }
}

function mapStateToProps(state) {
    return {
        notifications: state.notifications
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ closeMsg }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationBar);
