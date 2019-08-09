import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Meteor } from "meteor/meteor";

import { throwMsg, appClose } from "../../actions";

import _ from "lodash";

import { R } from "./";

import * as AQUI from "../../components/Window/core";

import Window, { WINDOW_PRIORITY_HIGH } from "../../components/Window";
import { passwordValidation } from "./password_util";
import { Accounts } from "meteor/accounts-base";

import EmployeeInitializeSchema from "../../../public/schemas/employee_initialization.schema.json";

import Ajv from "ajv";
import { translateJSONSchemaError } from "../../utils";

const ajv = new Ajv();

export class EmployeeInitialize extends Component {
    state = {
        page: 2,

        pwd_validate: false,
        old_pwd: "",
        pwd: "",
        pwd2: "",

        processing: false,

        info_validate1: false,
        email: "",
        nickname: "",
        email2: "",
        fname: "",
        mname: "",
        lname: "",
        gender: "",
        mobile: "",
        mobile2: "",
        ethnic: "",
        dob: "",

        info_validate2: false,
        id_type: "0",
        id_number: "",
        reg_type: "",
        addr_reg: "",
        addr_live: "",
        marital: "",
        political: "",
        emg_name: "",
        emg_number: "",

        info_validate3: false,
        edu_institution: "",
        edu_major: "",
        edu_degree: "",
        edu_graduate_time: "",
        le_name: "",
        le_dept_job: "",
        le_time_from: "",
        le_time_to: "",

        no_edu: false,
        no_le: false
    };

    // Front-end schema, aka Semantic Schema
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
                $eq: "pwd"
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
        },
        pwd_skip: {
            title: "I don't want to reset right now",
            type: "button",
            onClick: e => {
                e.preventDefault();
                this.setState({ page: this.state.page + 1 });
            }
        },
        email: {
            title: "Email",
            disabled: true,
            caption: "If you want to modify your email address, please contact admin."
        },
        email2: {
            title: "Email 2",
            valid: {
                $regex: /.+/
            },
            placeholder: "Optional"
        },
        nickname: {
            title: "Nickname",
            valid: {
                $regex: /.{5,}/
            }
        },
        fname: {
            title: "First Name",
            valid: {
                $regex: /.+/
            }
        },
        mname: {
            title: "Middle Name",
            valid: {
                $regex: /.+/
            },
            optional: true
        },
        lname: {
            title: "Last Name",
            valid: {
                $regex: /.+/
            },
            optional: true
        },
        gender: {
            title: "Gender",
            type: "select",
            options: {
                M: "Male",
                F: "Female"
            },
            valid: {
                $regex: /[MF]{1}/
            }
        },
        mobile: {
            title: "Mobile",
            type: "number",
            valid: {
                $regex: /.+/
            }
        },
        mobile2: {
            title: "Mobile 2",
            type: "number",
            valid: {
                $regex: /.+/
            },
            placeholder: "Optional"
        },
        ethnic: {
            title: "Ethnic",
            valid: {
                $regex: /.+/
            }
        },
        dob: {
            title: "Date of Birth",
            type: "date",
            valid: {
                $regex: /.+/
            }
        },
        id_type: {
            title: "ID Type",
            type: "select",
            options: {
                0: "Chinese ID",
                1: "Passport Number",
                2: "Others"
            }
        },
        id_number: {
            title: "ID Number",
            valid: {
                $regex: /.+/
            }
        },
        reg_type: {
            title: "Registry Type",
            type: "select",
            options: {
                0: "Local City",
                1: "Local Village",
                2: "Foreign City",
                3: "Foreign Villiage",
                4: "Others"
            }
        },
        marital: {
            title: "Marital Status",
            type: "select",
            options: {
                0: "Unmarried",
                1: "Married",
                2: "Divorced",
                3: "Others"
            }
        },
        political: {
            title: "Political Status",
            type: "select",
            options: {
                0: "No Party",
                1: "CPC League Member",
                2: "CPC Probationary Party Member",
                3: "CPC Party Member",
                4: "Others"
            }
        },
        addr_reg: {
            title: "Registry Address",
            valid: {
                $regex: /.+/
            }
        },
        addr_live: {
            title: "Live Address",
            valid: {
                $regex: /.+/
            }
        },
        emg_name: {
            title: "Emergency Contact",
            valid: {
                $regex: /.+/
            }
        },
        emg_number: {
            title: "Emergency Number",
            type: "number",
            valid: {
                $regex: /.+/
            }
        },
        no_edu: {
            title: "I don't have any educational degree",
            type: "checkbox",
            noUpload: true
        },
        edu_institution: {
            title: "Education Institution",
            valid: {
                $or: {
                    $regex: /.+/,
                    no_edu: true
                }
            },
            disabled: {
                no_edu: true
            }
        },
        edu_major: {
            title: "Major",
            valid: {
                $or: {
                    $regex: /.+/,
                    no_edu: true
                }
            },
            disabled: {
                no_edu: true
            }
        },
        edu_degree: {
            title: "Degree",
            type: "select",
            options: {
                0: "Primaary School",
                1: "Middle School",
                2: "Technical Secondary School",
                3: "High School",
                4: "Post-Secondary Education",
                5: "Bachelor's Degree",
                6: "Master's Degree",
                7: "PhD",
                8: "Post-doc",
                9: "Other"
            },
            valid: {
                $or: {
                    $regex: /.+/,
                    no_edu: true
                }
            },
            disabled: {
                no_edu: true
            }
        },
        edu_graduate_time: {
            title: "Graduate Date",
            type: "date",
            valid: {
                $or: {
                    $regex: /.+/,
                    no_edu: true
                }
            },
            disabled: {
                no_edu: true
            }
        },
        no_le: {
            title: "I haven't been employed before",
            type: "checkbox",
            noUpload: true
        },
        le_name: {
            title: "Last Employer Name",
            valid: {
                $or: {
                    $regex: /.+/,
                    no_le: true
                }
            },
            disabled: {
                no_le: true
            }
        },
        le_dept_job: {
            title: "Last Job Title",
            valid: {
                $or: {
                    $regex: /.+/,
                    no_le: true
                }
            },
            disabled: {
                no_le: true
            }
        },
        le_time_from: {
            title: "Last Job Start Time",
            type: "date",
            valid: {
                $or: {
                    $regex: /.+/,
                    no_le: true
                }
            },
            disabled: {
                no_le: true
            }
        },
        le_time_to: {
            title: "Last Job End Time",
            type: "date",
            valid: {
                $or: {
                    $regex: /.+/,
                    no_le: true
                }
            },
            disabled: {
                no_le: true
            }
        },
        info_validate1: {
            title: "Next Page",
            type: "button",
            disabled: {
                $or: {
                    nickname: "$!valid",
                    fname: "$!valid",
                    lname: "$!valid",
                    gender: "$!valid",
                    mobile: "$!valid",
                    ethnic: "$!valid",
                    dob: "$!valid"
                }
            },
            onClick: e => {
                e.preventDefault();
                this.setState({ page: this.state.page + 1 });
            },
            noUpload: true
        },
        info_validate2: {
            title: "Next Page",
            type: "button",
            disabled: {
                $or: {
                    id_type: "$!valid",
                    id_number: "$!valid",
                    reg_type: "$!valid",
                    addr_reg: "$!valid",
                    addr_live: "$!valid",
                    marital: "$!valid",
                    political: "$!valid",
                    emg_name: "$!valid",
                    emg_number: "$!valid"
                }
            },
            onClick: e => {
                e.preventDefault();
                this.setState({ page: this.state.page + 1 });
            },
            noUpload: true
        },
        info_validate3: {
            title: "Next Page",
            type: "button",
            disabled: {
                $or: {
                    edu_institution: "$!valid",
                    edu_major: "$!valid",
                    edu_degree: "$!valid",
                    edu_graduate_time: "$!valid",
                    le_name: "$!valid",
                    le_dept_job: "$!valid",
                    le_time_from: "$!valid",
                    le_time_to: "$!valid"
                }
            },
            onClick: e => {
                e.preventDefault();
                this.setState({ page: this.state.page + 1 });
            },
            noUpload: true
        },
        previous_page: {
            title: "Previous Page",
            type: "button",
            onClick: e => {
                e.preventDefault();
                this.setState({ page: this.state.page - 1 });
            },
            noUpload: true
        },
        submit: {
            title: "Submit",
            type: "button",
            onClick: e => {
                this.handleInfoSubmit();
            },
            noUpload: true
        }
    };

    handlePasswordSubmit = () => {
        let { old_pwd, pwd, pwd2 } = this.state;
        this.setState({ processing: true });

        if (!old_pwd || !pwd || !pwd2 || pwd !== pwd2) {
            this.setState({ processing: false });
            this.props.context.props.throwMsg(R.Msg("NEW_PASSWORD_NOT_MATCH"));
            return;
        }

        if (!passwordValidation(pwd)) {
            this.setState({ processing: false });
            this.props.context.props.throwMsg(R.Msg("NEW_PASSWORD_NOT_VALID"));
            return;
        }

        Accounts.changePassword(old_pwd, pwd, err => {
            this.setState({ processing: false });
            if (err) {
                this.props.context.props.throwMsg(
                    R.Msg("CHANGE_PASSWORD_FAILED", {
                        error: err.reason
                    })
                );
            } else {
                this.props.context.props.throwMsg(R.Msg("CHANGE_PASSWORD_SUCCESSFUL"));
                this.setState({ page: this.state.page + 1 });
            }
        });
    };

    handleInfoSubmit = () => {
        let packedData = AQUI.schemaDataPack(this.schema, this.state);

        // Front-end validation
        const validationResult = ajv.validate(EmployeeInitializeSchema, packedData);
        if (!validationResult) {
            this.props.throwMsg(
                R.Msg("EMPLOYEE_REGISTER_ERR", {
                    error: ajv.errorsText()
                })
            );
            return;
        }

        this.setState({ processing: true });

        // Server-side validation
        Meteor.call("employee_register", packedData, (error, res) => {
            this.setState({ processing: false });
            if (error) this.props.throwMsg(R.Msg("EMPLOYEE_REGISTER_ERR", { error }));
            else if (res && res.status === 200) {
                this.props.throwMsg(R.Msg("EMPLOYEE_REGISTER_SUCCESSFUL"));
                this.setState({ page: this.state.page + 1 });
            } else if (res && res.status === 400) {
                this.props.throwMsg(
                    R.Msg("EMPLOYEE_REGISTER_ERR", {
                        error: res.err
                    })
                );
            } else {
                this.props.throwMsg(
                    R.Msg("EMPLOYEE_REGISTER_ERR", {
                        error: res
                    })
                );
            }
        });
    };

    renderPage = () => {
        switch (this.state.page) {
            case 0: {
                return (
                    <div className="window-content-inner handle vbc v-full h-full">
                        <div className="vcc v-full">
                            <h1 style={{ fontSize: "3rem", marginBottom: 8 }}>{R.Str("UCI_WELCOME_TITLE")}</h1>
                            <p>{R.Str("UCI_WELCOME_DESCRIPTION")}</p>
                        </div>
                        <div>
                            <button className="aqui-btn " onClick={e => this.setState({ page: this.state.page + 1 })}>
                                {R.Str("CONTINUE")}
                            </button>
                        </div>
                    </div>
                );
            }
            case 1: {
                return (
                    <div className="window-content-inner handle vbc h-full v-full">
                        <div className="vbc">
                            <h1 style={{ marginBottom: 8 }}>Set up your password</h1>
                            <p style={{ marginTop: 0 }}>
                                You've been already received your temporary password. Now, it's time to set it by your own. We have several rules to make sure
                                your password is secure enough as following.
                            </p>
                        </div>

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

                        <div className="vsc h-full" style={{ maxWidth: "480px" }}>
                            <AQUI.FieldItem context={this} schema={this.schema} name="old_pwd" />
                            <AQUI.FieldItem context={this} schema={this.schema} name="pwd" />
                            <AQUI.FieldItem context={this} schema={this.schema} name="pwd2" />
                        </div>

                        <div className="hcc h-full">
                            <AQUI.FieldItem context={this} schema={this.schema} name="pwd_validate" />
                        </div>
                    </div>
                );
            }
            case 2: {
                return (
                    <div className="window-content-inner handle vbc">
                        <div className="vbc h-full v-full">
                            <div className="vbc">
                                <h1 style={{ marginBottom: 8 }}>Your Basic Infomation</h1>
                                <p style={{ marginTop: 0 }}>Be careful about these information. You rarely have chance to set them.</p>
                            </div>

                            <div id="page-2" className="vbc h-full">
                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="email" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="email2" />
                                </AQUI.InputGroup>
                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="nickname" width={"50%"} />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="fname" width={"16.67%"} />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="mname" width={"16.67%"} />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="lname" width={"16.67%"} />
                                </AQUI.InputGroup>

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="gender" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="ethnic" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="dob" />
                                </AQUI.InputGroup>

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="mobile" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="mobile2" />
                                </AQUI.InputGroup>
                            </div>

                            <div className="hec h-full">
                                <AQUI.FieldItem context={this} schema={this.schema} name="info_validate1" />
                            </div>
                        </div>
                    </div>
                );
            }
            case 3: {
                return (
                    <div className="window-content-inner handle vbc">
                        <div className="vbc h-full v-full">
                            <div className="vbc">
                                <h1 style={{ marginBottom: 8 }}>Identity Information</h1>
                                <p style={{ marginTop: 0 }}>These information will be kept highly secret, only use when necessary.</p>
                            </div>

                            <div id="page-3" className="vbc h-full">
                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="id_type" width={"50%"} />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="id_number" />
                                </AQUI.InputGroup>

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="reg_type" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="marital" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="political" />
                                </AQUI.InputGroup>

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="addr_reg" />
                                </AQUI.InputGroup>

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="addr_live" />
                                </AQUI.InputGroup>

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="emg_name" width={"50%"} />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="emg_number" />
                                </AQUI.InputGroup>
                            </div>

                            <div className="hbc h-full">
                                <AQUI.FieldItem context={this} schema={this.schema} name="previous_page" />
                                <AQUI.FieldItem context={this} schema={this.schema} name="info_validate2" />
                            </div>
                        </div>
                    </div>
                );
            }
            case 4: {
                return (
                    <div className="window-content-inner handle vbc">
                        <div className="vbc h-full v-full">
                            <div className="vbc">
                                <h1 style={{ marginBottom: 8 }}>Education & Employment Info</h1>
                                <p style={{ marginTop: 0 }}>These information will be kept highly secret, only use when necessary.</p>
                            </div>

                            <div id="page-4" className="vbc h-full">
                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="no_edu" />
                                </AQUI.InputGroup>

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="edu_institution" />
                                </AQUI.InputGroup>

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="edu_major" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="edu_degree" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="edu_graduate_time" type="date" />
                                </AQUI.InputGroup>

                                <hr />

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="no_le" />
                                </AQUI.InputGroup>

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="le_name" />
                                </AQUI.InputGroup>

                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="le_dept_job" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="le_time_from" type="date" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="le_time_to" type="date" />
                                </AQUI.InputGroup>
                            </div>

                            <AQUI.InputGroup>
                                <AQUI.FieldItem context={this} schema={this.schema} name="previous_page" />
                                <AQUI.FieldItem context={this} schema={this.schema} name="info_validate3" />
                            </AQUI.InputGroup>
                        </div>
                    </div>
                );
            }
            case 5: {
                return (
                    <div className="window-content-inner handle vbc">
                        <div className="vbc h-full v-full">
                            <div className="vbc">
                                <h1 style={{ marginBottom: 8 }}>Review</h1>
                                <p style={{ marginTop: 0 }}>
                                    Please review the information carefully, then submit at the bottom. If you want to modify your input, click Previous Page.
                                </p>
                            </div>

                            <div id="page-5" className="vbc v-full" style={{ width: "75%", overflow: "scroll" }}>
                                {this.renderReview()}
                                <AQUI.InputGroup>
                                    <AQUI.FieldItem context={this} schema={this.schema} name="previous_page" />
                                    <AQUI.FieldItem context={this} schema={this.schema} name="submit" />
                                </AQUI.InputGroup>
                            </div>
                        </div>
                    </div>
                );
            }
            case 6: {
                return (
                    <div className="window-content-inner handle vbc v-full h-full">
                        <div className="vcc v-full">
                            <h1 style={{ fontSize: "3rem", marginBottom: 8 }}>Register Complete</h1>
                            <p>Admins will validate your data. Come back to User Center later.</p>
                        </div>
                        <div>
                            <button
                                className="aqui-btn"
                                onClick={() => {
                                    this.props.appClose("user_center");
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                );
            }
        }
    };

    renderReview = () => {
        let reviewFields = [
            "nickname",
            "email2",
            "fname",
            "mname",
            "lname",
            "gender",
            "mobile",
            "mobile2",
            "ethnic",
            "dob",
            "id_type",
            "id_number",
            "reg_type",
            "addr_reg",
            "addr_live",
            "marital",
            "political",
            "emg_name",
            "emg_number",
            "edu_institution",
            "edu_major",
            "edu_degree",
            "edu_graduate_time",
            "le_name",
            "le_dept_job",
            "le_time_from",
            "le_time_to"
        ];

        let renderedFields = [];

        for (let name of reviewFields) {
            if (this.state[name]) {
                renderedFields.push(
                    <AQUI.PanelItem
                        key={name}
                        title={this.schema[name].title}
                        value={this.schema[name].type === "select" ? this.schema[name].options[this.state[name]] : this.state[name]}
                    />
                );
            }
        }

        return <div className="panel unhandle">{renderedFields}</div>;
    };

    render() {
        return (
            <Window
                canClose={false}
                canMaximize={false}
                canMinimize={false}
                noControl={true}
                key={"Employee Initialize"}
                _key={"Employee Initialize"}
                width={900}
                height={700}
                appKey={this.props.context.props.appKey}
                windowPriority={WINDOW_PRIORITY_HIGH}
                theme="dark"
            >
                {this.renderPage()}
            </Window>
        );
    }

    componentDidMount() {
        for (let field in this.props.user) {
            this.setState({ [field]: this.props.user[field] });
        }
        if (this.props.user.status === 10) {
            this.setState({ page: 6 });
        }
    }
}

const mapStateToProps = state => ({
    user: state.user,
    auth: state.auth
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ throwMsg, appClose }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeInitialize);
