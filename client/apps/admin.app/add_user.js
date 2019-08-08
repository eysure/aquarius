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

    schema = {
        username: {
            title: R.Str("USERNAME"),
            valid: {
                $regex: /.{5,}/
            },
            placeholder: R.Str("USERNAME")
        },
        email: {
            title: R.Str("EMAIL"),
            valid: {
                $regex: /\S+@\S+\.\S+/
            },
            placeholder: R.Str("EMAIL")
        },
        create: {
            type: "button",
            title: R.Str("CREATE"),
            disabled: {
                $or: {
                    username: "$!valid",
                    email: "$!valid"
                }
            },
            onClick: e => this.handleSubmit(e)
        }
    };

    handleSubmit = e => {
        if (!checkAuth("user_admin", R.Str("ADD_USER"), this.props.context)) return;

        let { username, email } = this.state;

        this.setState({ processing: true });
        Meteor.call("addUser", username, email, (err, res) => {
            this.setState({ processing: false });
            if (err) {
                this.props.context.props.throwMsg(R.Msg("ERR", { err }));
            } else {
                this.props.context.props.throwMsg(R.Msg("USER_ADDED"));
            }
        });
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

                    <AQUI.FieldItem context={this} schema={this.schema} name="username" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="email" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="create" />
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
