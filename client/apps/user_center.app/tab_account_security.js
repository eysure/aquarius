import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import Str, { getStr } from "../../components/string_component";

import * as UI from "@material-ui/core";

import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { throwMsg } from "../../actions";
import PI from "../../components/panel_item";
import clientConfig from "../../client_config";

import { R } from "./";

const pwdLen = /^.{8,}$/;
const pwdUpper = /^(?=.*[A-Z]).{0,}$/;
const pwdLower = /^(?=.*[a-z]).{0,}$/;
const pwdDigit = /^(?=.*[0-9]).{0,}$/;
const pwdSpecial = /^(?=.*[\\\~\`\!\@\#\$\%\^\&\*\(\)\+\=\_\-\{\}\[\]\|\:\;\"\'\?\/\<\>\,\.]).{0,}$/;
const pwdNothingElse = /[^\d\w\\\~\`\!\@\#\$\%\^\&\*\(\)\+\=\_\-\{\}\[\]\|\:\;\"\'\?\/\<\>\,\.]/;

class AccountSecurityTab extends React.Component {
    state = {
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: "",
        newPasswordVisibility: false,
        newPasswordValidated: false
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
        e.preventDefault();

        if (e.target.name === "newPassword") {
            this.setState({
                newPasswordValidated: this.passwordValidation(e.target.value)
            });
        }
    };

    passwordValidation = password => {
        let length = pwdLen.exec(password) ? true : false;
        let upperCase = pwdUpper.exec(password) ? 1 : 0;
        let lowerCase = pwdLower.exec(password) ? 1 : 0;
        let digit = pwdDigit.exec(password) ? 1 : 0;
        let special = pwdSpecial.exec(password) ? 1 : 0;
        let noForbidden = pwdNothingElse.exec(password) ? false : true;

        return length && upperCase + lowerCase + digit + special >= 2 && noForbidden;
    };

    handlePasswordChange = () => {
        let { currentPassword, newPassword, repeatNewPassword } = this.state;
        if (!currentPassword || !newPassword || !repeatNewPassword) {
            this.props.throwMsg(R.Msg("MSG_FILL_ALL_FIELDS"));
            return;
        }

        if (newPassword !== repeatNewPassword) {
            this.props.throwMsg(R.Msg("MSG_NEW_PASSWORD_NOT_MATCH"));
            this.setState({ newPassword: "", repeatNewPassword: "" });
            return;
        }

        // Demo only
        if (clientConfig.demo) {
            this.props.throwMsg(R.Msg("DEMO_CANT_CHANGE_PASSWORD"));
            return;
        }

        Accounts.changePassword(currentPassword, newPassword, error => {
            if (error) {
                this.props.throwMsg(R.Msg("CHANGE_PASSWORD_FAILED", { error: error.message }));
                return;
            }
            Meteor.logout();
            this.props.throwMsg(R.Msg("CHANGE_PASSWORD_SUCCESSFUL"));
        });
    };

    render() {
        return (
            <div className="panel-container-inner">
                <div className="panel-title">{R.Str("CHANGE_PASSWORD")}</div>

                <div className="panel">
                    <PI
                        title={R.Str("CURRENT_PASSWORD")}
                        value={this.state.currentPassword}
                        onChange={this.handleChange}
                        input
                        name="currentPassword"
                        type="password"
                    />
                    <PI title={R.Str("NEW_PASSWORD")} value={this.state.newPassword} onChange={this.handleChange} input name="newPassword" type="password" />
                    <PI
                        title={R.Str("REPEAT_NEW_PASSWORD")}
                        value={this.state.repeatNewPassword}
                        onChange={this.handleChange}
                        input
                        name="repeatNewPassword"
                        type="password"
                    />
                </div>
                <div className="panel-title">{R.Str("PASSWORD_REQUIREMENT")}</div>
                <div className="panel-title">
                    <ul>
                        <li>{R.Str("PASSWORD_REQUIREMENT_1")}</li>
                        <li>{R.Str("PASSWORD_REQUIREMENT_2")}</li>
                        <ul>
                            <li>{R.Str("PASSWORD_REQUIREMENT_3")}</li>
                            <li>{R.Str("PASSWORD_REQUIREMENT_4")}</li>
                            <li>{R.Str("PASSWORD_REQUIREMENT_5")}</li>
                            <li>{R.Str("PASSWORD_REQUIREMENT_6")}</li>
                        </ul>
                        <li>{R.Str("PASSWORD_REQUIREMENT_7")}</li>
                    </ul>
                </div>

                <UI.Button
                    color="primary"
                    disabled={!(this.state.currentPassword && this.state.newPasswordValidated && this.state.newPassword === this.state.repeatNewPassword)}
                    variant="outlined"
                    style={{ width: "100%" }}
                    onClick={this.handlePasswordChange}
                >
                    {R.Str("SUBMIT")}
                </UI.Button>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountSecurityTab);
