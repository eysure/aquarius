import React, { Component } from "react";
import { connect } from "react-redux";
import PI from "../../components/panel_item";

import { R } from "./";

import Window from "../../components/Window";

export class UserManager extends Component {
    state = {
        openNewUserWindow: false
    };

    render() {
        return (
            <div className="window-content-inner">
                <div className="panel-title">{R.Str("ADD_USER")}</div>
                <div className="panel">
                    <PI title={R.Str("ADD_USER")} onClick={() => this.setState({ openNewUserWindow: true })} />
                </div>
                {this.renderNewUserWindow()}
            </div>
        );
    }

    renderNewUserWindow = () => {
        return (
            this.state.openNewUserWindow && (
                <Window
                    onClose={() => this.setState({ openNewUserWindow: false })}
                    key={"add_user"}
                    _key={"add_user"}
                    width={600}
                    appKey={this.props.context.props.appKey}
                    theme="dark"
                >
                    <div className="window-content-inner handle">New User</div>
                </Window>
            )
        );
    };
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserManager);
