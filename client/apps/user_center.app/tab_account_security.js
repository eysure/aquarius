import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";

import * as AQUI from "../../components/Window/core";

import { Accounts } from "meteor/accounts-base";
import { throwMsg } from "../../actions";

import { R } from "./";
import { passwordValidation } from "./password_util";
import { checkAuth } from "../../utils";

class AccountSecurityTab extends React.Component {
    state = {
        old_pwd: "",
        pwd: "",
        pwd2: "",
        processing: false,
        pwd_validate: false
    };

    schema = {
        old_pwd: {
            title: "Old Password",
            type: "password",
            valid: {
                $regex: /.+/
            }
        },
        pwd: {
            title: "New Password",
            type: "password",
            valid: {
                $func: val => passwordValidation(val)
            }
        },
        pwd2: {
            title: "Repeat New Password",
            type: "password",
            valid: {
                $eq: "#pwd"
            }
        },
        pwd_validate: {
            title: "Set",
            type: "button",
            disabled: {
                $or: {
                    old_pwd: "$!valid",
                    pwd: "$!valid",
                    pwd2: "$!valid"
                }
            },
            onClick: () => this.handlePasswordSubmit()
        }
    };

    handlePasswordSubmit = () => {
        if ((!checkAuth("change_password"), R.Str("CHANGE_PASSWORD"), this)) return;

        let { old_pwd, pwd, pwd2 } = this.state;
        this.setState({ processing: true });

        if (!old_pwd || !pwd || !pwd2 || pwd !== pwd2) {
            this.setState({ processing: false });
            this.props.throwMsg(R.Msg("NEW_PASSWORD_NOT_MATCH"));
            return;
        }

        if (!passwordValidation(pwd)) {
            this.setState({ processing: false });
            this.props.throwMsg(R.Msg("NEW_PASSWORD_NOT_VALID"));
            return;
        }

        Accounts.changePassword(old_pwd, pwd, err => {
            this.setState({ processing: false });
            if (err) {
                this.props.throwMsg(
                    R.Msg("CHANGE_PASSWORD_FAILED", {
                        error: err.reason
                    })
                );
            } else {
                this.props.throwMsg(R.Msg("CHANGE_PASSWORD_SUCCESSFUL"));
                this.setState({
                    old_pwd: "",
                    pwd: "",
                    pwd2: "",
                    pwd_validate: false
                });
            }
        });
    };

    render() {
        return (
            <div className="window-content-inner">
                <div className="panel-title">{R.Str("CHANGE_PASSWORD")}</div>
                <div className="panel-title">{R.Str("PASSWORD_REQUIREMENT")}</div>
                <ul
                    style={{
                        background: "rgba(180,180,180,0.5)",
                        borderRadius: "12px",
                        padding: "16px",
                        paddingLeft: "40px",
                        color: "#444"
                    }}
                >
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

                <div className="vsc h-full">
                    <AQUI.FieldItem context={this} schema={this.schema} name="old_pwd" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="pwd" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="pwd2" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="pwd_validate" />
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg }, dispatch);
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        user: state.user
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountSecurityTab);
