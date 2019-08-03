import React, { Component } from "react";
import { connect } from "react-redux";
import { Meteor } from "meteor/meteor";

import { R } from "./";

import * as AQUI from "../../components/Window/core";

import Window from "../../components/Window";
import { checkAuth } from "../../utils";

export class AddUser extends Component {
    state = {
        username: "",
        email: "",
        processing: false,
        validate: false
    };

    handleSubmit = e => {
        if (!checkAuth("user_admin", R.Str("ADD_USER"), this.props.context)) return;

        let { username, email } = this.state;

        this.setState({ processing: true });
        Meteor.call("addUser", username, email, (err, res) => {
            this.setState({ processing: false });
            if (err || res.err) {
                this.props.context.props.throwMsg(R.Msg("ERR", { err: err || res.err }));
            } else {
                this.props.context.props.throwMsg(R.Msg("USER_ADDED"));
            }
        });
    };

    handleChange = e => {
        let valid = this.state.username.length > 0 && this.state.email.length > 0 && /\S+@\S+\.\S+/.test(this.state.email);
        this.setState({ validate: valid });
    };

    render() {
        return (
            <Window
                onClose={this.props.onClose}
                key={"add_user"}
                _key={"add_user"}
                width={480}
                appKey={this.props.context.props.appKey}
                theme="dark"
                escToClose
            >
                <div className="window-content-inner handle">
                    <h1>{R.Str("CREATE_NEW_USER")}</h1>

                    <p className="aqui-input-title">{R.Str("USERNAME")}</p>
                    <AQUI.Input disabled={this.state.processing} placeholder="Username" binding={this} name="username" onChange={this.handleChange} />

                    <p className="aqui-input-title">{R.Str("EMAIL")}</p>
                    <AQUI.Input disabled={this.state.processing} placeholder="Email" binding={this} name="email" onChange={this.handleChange} />

                    <AQUI.Button disabled={!this.state.validate || this.state.processing} onClick={this.handleSubmit}>
                        {R.Str("CREATE")}
                    </AQUI.Button>
                </div>
            </Window>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddUser);
