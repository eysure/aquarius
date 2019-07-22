import React, { Component } from "react";
import { connect } from "react-redux";
import PI from "../../components/panel_item";

import { R } from "./";

import * as AQUI from "../../components/Window/core";

import Window from "../../components/Window";

export class AddUser extends Component {
    state = {
        username: "",
        email: ""
    };

    render() {
        return (
            <Window
                onClose={this.props.onClose}
                key={"add_user"}
                _key={"add_user"}
                width={600}
                appKey={this.props.context.props.appKey}
                theme="dark"
                escToClose
            >
                <div className="window-content-inner handle">
                    <h1>New User</h1>

                    <p>Username</p>
                    <AQUI.Input placeholder="Username" binding={this} name="username" />

                    <p>Email Address</p>
                    <AQUI.Input placeholder="Email" binding={this} name="email" />

                    <AQUI.Button>Create</AQUI.Button>
                </div>
            </Window>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddUser);
