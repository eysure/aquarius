import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import clientConfig from "../client_config";
import Str, { getStr, getLanguage } from "./string_component";
import { Meteor } from "meteor/meteor";
import _ from "lodash";
import { R } from "../resources_feeder";
import Avatar from "./user_avatar";
import { Tracker } from "meteor/tracker";

import { clearMsg, logout, serverLogout, bindUserInfo, bindEmployeesInfo, throwMsg, changeLanguageLocal, appLaunch, systemControl } from "../actions";
import { generateEmailLinkToService, getLocalCollection } from "../utils";

class AccessControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "tester@xyzhu.me",
            password: "Xyzhu_8888",
            processing: false
        };
    }

    componentDidMount() {
        // Demo only
        if (clientConfig.demo) this.props.throwMsg(R.Msg("DEMO_WELCOME"));

        Tracker.autorun(() => {
            // Server logout
            if (this.props.system.loginFlag && !Meteor.userId()) {
                this.props.serverLogout();
                return;
            }

            // User login, fetch user's employee info
            if (Meteor.user()) {
                // use subscribe to log invalid user out immidiately.
                let employee = getLocalCollection("employees").findOne({ email: Meteor.user().emails[0].address });
                if (!employee) return;
                if (employee.status < 1) {
                    this.handleLoginError({ error: 1001 });
                    return;
                }
                this.props.bindUserInfo(employee);
            }
        });
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        event.preventDefault();
    };

    handleSubmit = (event, userEmail = null) => {
        event.preventDefault();
        let { email, password } = this.state;

        if (userEmail) email = userEmail;

        if (!email || !password) {
            return;
        }

        this.setState({ processing: true });

        Meteor.loginWithPassword(email, password, error => {
            this.setState({ processing: false });
            if (error) this.handleLoginError(error);
            else {
                if (this.state.switchUser) this.setState({ switchUser: false });
                Meteor.call("testEmployeeExist", (err, employee) => {
                    if (!employee) {
                        this.handleLoginError({ error: 1000 });
                        return;
                    }
                    if (employee.status !== 1) {
                        this.handleLoginError({ error: 1001 });
                        return;
                    }
                    this.handleLoginSuccessful(employee);
                });
            }
        });
    };

    handleLoginSuccessful = employee => {
        localStorage.setItem(
            "lastLoginUser",
            JSON.stringify({
                nickname: employee.nickname,
                avatar: employee.avatar,
                email: employee.email,
                desktop: _.get(employee, "preferences.desktop", null)
            })
        );
        this.props.throwMsg(
            R.Msg("LOGIN_SUCCESSFUL", {
                username: employee.nickname
            })
        );
        this.props.appLaunch("welcome");
    };

    handleLoginError = error => {
        let content = [error.message, error.message];

        switch (error.error) {
            case 400: {
                content = R.Str("LOGIN_FAILED_INVALID_INPUT");
                break;
            }
            case 403: {
                content = R.Str("LOGIN_FAILED_WRONG_PASSWORD");
                break;
            }
            case 1000: {
                content = R.Str("LOGIN_FAILED_NO_EMPLOYEE");
                break;
            }
            case 1001: {
                content = R.Str("LOGIN_FAILED_DISABLED");
                break;
            }
            default:
                break;
        }
        if (this.state.processing) this.setState({ processing: false, password: "" });
        if (Meteor.userId()) Meteor.logout(error => this.props.logout(error, { noMsg: true }));

        this.props.throwMsg(
            R.Msg("LOGIN_FAILED", {
                content,
                moreUri: generateEmailLinkToService("登录失败请求帮助", `账户: ${this.state.email}%0D%0A错误信息: ${content}`),
                moreButton: "Email"
            })
        );
    };

    // Handle local language change, usually before login (don't have state.user.auth)
    handleLangChange() {
        let newLan = (getLanguage(this.props.user) + 1) % clientConfig.languages.length;
        this.props.changeLanguageLocal(newLan);
    }

    lockScreenComponentStyle = offset => {
        return {
            position: "absolute",
            top: `calc(50% + ${offset}px)`
        };
    };

    renderLockScreen(user) {
        return (
            <div id="access-control">
                <UI.Dialog PaperProps={{ id: "lockscreen-paper" }} open={Meteor.userId() ? false : true} disablePortal={true}>
                    <Avatar style={this.lockScreenComponentStyle(-180)} d={120} user={user} round />
                    <div
                        style={{
                            ...this.lockScreenComponentStyle(-48),
                            fontFamily: "San Francisco",
                            fontWeight: 100,
                            color: "white"
                        }}
                    >
                        {user.nickname || user.email}
                    </div>
                    <form
                        style={{
                            ...this.lockScreenComponentStyle(0),
                            background: "rgba(255,255,255,0.15)",
                            borderRadius: "6px"
                        }}
                    >
                        <UI.Input
                            style={{
                                color: "white",
                                fontWeight: 100,
                                fontFamily: "San Francisco",
                                padding: "0 8px"
                            }}
                            disabled={this.state.processing}
                            autoFocus
                            disableUnderline
                            name="password"
                            type="password"
                            placeholder={getStr("ENTER_PASSWORD")}
                            endAdornment={
                                <UI.InputAdornment position="end">
                                    <UI.IconButton
                                        style={{
                                            padding: 0,
                                            color: "rgba(255,255,255,0.2)"
                                        }}
                                        type="submit"
                                        disabled={this.state.processing}
                                        aria-label="login-btn"
                                        onClick={e => this.handleSubmit(e, user.email)}
                                    >
                                        <i className="material-icons">play_circle_outline</i>
                                    </UI.IconButton>
                                </UI.InputAdornment>
                            }
                            onChange={this.handleChange}
                            value={this.state.password}
                        />
                    </form>
                    <div
                        style={{
                            position: "absolute",
                            bottom: "120px",
                            fontFamily: "San Francisco",
                            fontWeight: 100,
                            color: "white"
                        }}
                    >
                        <UI.Button
                            style={{
                                display: "block",
                                color: "white",
                                textTransform: "none"
                            }}
                            onClick={() => this.setState({ switchUser: true })}
                        >
                            <i className="material-icons">code</i>
                            <br />
                            <Str SWITCH_USER />
                        </UI.Button>
                    </div>
                </UI.Dialog>
            </div>
        );
    }

    render() {
        if (Meteor.userId()) return null;
        let lastLoginUser = localStorage.getItem("lastLoginUser");
        if (lastLoginUser && !this.state.switchUser) {
            return this.renderLockScreen(JSON.parse(lastLoginUser));
        }

        return (
            <div id="access-control">
                <UI.Dialog
                    PaperProps={{
                        className: "dialog",
                        elevation: 12,
                        style: { width: "360px" }
                    }}
                    open={Meteor.userId() ? false : true}
                    aria-labelledby="login-dialog-title"
                    disablePortal={true}
                >
                    <form>
                        <UI.DialogTitle id="login-dialog-title">
                            <div className="flex-between">
                                <Str WELCOME />
                                <UI.IconButton size="small" component="span" disabled={this.state.processing} onClick={this.handleLangChange.bind(this)}>
                                    <i className="material-icons">translate</i>
                                </UI.IconButton>
                            </div>
                        </UI.DialogTitle>
                        <UI.DialogContent id="login-dialog-content">
                            <UI.TextField
                                disabled={this.state.processing}
                                autoFocus
                                autoComplete="username"
                                name="email"
                                label={<Str EMAIL />}
                                type="email"
                                placeholder="yourname@company.com"
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <UI.InputAdornment position="start">
                                            <i className="material-icons">email</i>
                                        </UI.InputAdornment>
                                    )
                                }}
                                onChange={this.handleChange}
                                value={this.state.email}
                            />
                            <UI.TextField
                                disabled={this.state.processing}
                                autoComplete="current-password"
                                name="password"
                                label={<Str PASSWORD />}
                                type="password"
                                placeholder="Enter Password"
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <UI.InputAdornment position="start">
                                            <i className="material-icons">lock</i>
                                        </UI.InputAdornment>
                                    ),
                                    endAdornment: (
                                        <UI.InputAdornment position="end">
                                            <UI.IconButton
                                                type="submit"
                                                disabled={this.state.processing}
                                                aria-label="login-btn"
                                                onClick={this.handleSubmit.bind(this)}
                                            >
                                                <i className="material-icons">play_circle_outline</i>
                                            </UI.IconButton>
                                        </UI.InputAdornment>
                                    )
                                }}
                                onChange={this.handleChange}
                                value={this.state.password}
                            />
                        </UI.DialogContent>
                    </form>
                    {this.state.processing ? <UI.LinearProgress className="zdialog-bottom-radius" /> : ""}
                </UI.Dialog>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            clearMsg,
            logout,
            serverLogout,
            bindUserInfo,
            bindEmployeesInfo,
            throwMsg,
            changeLanguageLocal,
            appLaunch,
            systemControl
        },
        dispatch
    );
}

function mapStateToProps(state) {
    return { user: state.user, system: state.system };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccessControl);
