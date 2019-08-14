import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as AQUI from "../../components/Window/core";
import { R } from "./index";
import _ from "lodash";

import Window from "../../components/Window";
import { getCountryList, upload, Collection, oss } from "../../utils";

import { throwMsg } from "../../actions";
import { Meteor } from "meteor/meteor";
import Popup from "../../components/Window/popup";

class CustomerBasicInfo extends Component {
    state = {
        _id: "",
        logo: "",
        abbr: "",
        name: "",
        country: "",
        type: "",
        address: "",
        tel: "",
        website: "",
        fax: "",
        name_cn: "",
        remark: "",
        processing: false,
        deleteDoubleCheck: false,
        modified: false
    };

    schema = {
        logo: {
            title: R.Str("logo"),
            type: "image",
            style: {
                width: 181,
                height: 112,
                padding: 4
            },
            srcTranslator: val => oss(val),
            handleDrop: files => {
                upload(
                    files[0],
                    {
                        db: "customers",
                        findOne: { _id: this.props.id },
                        field: "logo"
                    },
                    () => {
                        this.props.throwMsg(
                            R.Msg("FILE_UPLOADING", {
                                key: `CUSTOMER_LOGO_UPLOAD_${this.props.id._str}`
                            })
                        );
                    },
                    (err, res) => {
                        if (err) {
                            this.props.throwMsg(
                                R.Msg("SERVER_ERROR", {
                                    key: `CUSTOMER_LOGO_UPLOAD_${this.props.id._str}`,
                                    ...err
                                })
                            );
                        } else {
                            this.props.throwMsg(
                                R.Msg("FILE_UPLOADED", {
                                    key: `CUSTOMER_LOGO_UPLOAD_${this.props.id._str}`
                                })
                            );
                            return true;
                        }
                    }
                );
            }
        },
        abbr: {
            title: R.Str("abbr"),
            valid: {
                $regex: /.+/
            }
        },
        name: {
            title: R.Str("name"),
            valid: {
                $regex: /.+/
            }
        },
        country: {
            title: R.Str("country"),
            type: "select",
            options: getCountryList()
        },
        type: {
            title: R.Str("type"),
            type: "select",
            options: {
                0: R.Str("type_0"),
                1: R.Str("type_1"),
                2: R.Str("type_2"),
                3: R.Str("type_3"),
                4: R.Str("type_4")
            }
        },
        website: {
            title: R.Str("website")
        },
        remark: {
            title: R.Str("remark"),
            type: "textarea",
            placeholder: R.Str("remark")
        },
        save: {
            title: R.Str("SAVE"),
            type: "button",
            disabled: {
                $or: {
                    abbr: "$!valid",
                    name: "$!valid",
                    country: "$!valid",
                    type: "$!valid",
                    modified: false
                }
            },
            onClick: e => {
                this.handleSave(e);
            }
        },
        delete: {
            title: R.Str("DELETE"),
            type: "button",
            onClick: e => {
                this.setState({ deleteDoubleCheck: true });
            }
        }
    };

    handleSave = e => {
        this.setState({ processing: true });
        let packedData = AQUI.schemaDataPack(this.schema, this.state);
        packedData._id = this.state._id;
        Meteor.call("editCustomer", packedData, (err, res) => {
            this.setState({ processing: false });
            if (err) {
                this.props.throwMsg(R.Msg("SERVER_ERROR", err));
            } else {
                this.props.throwMsg(R.Msg("SAVED"));
            }
        });
    };

    handleDelete = e => {
        Meteor.call("deleteCustomer", this.state._id, (err, res) => {
            this.setState({ processing: false });
            if (err) {
                this.props.throwMsg(R.Msg("SERVER_ERROR", err));
            } else {
                this.props.throwMsg(R.Msg("DELETED"));
                this.props.onClose();
            }
        });
    };

    render() {
        if (!this.state._id) return null;
        return (
            <>
                <div className="window-content-inner handle">
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema} name="logo" width="auto" />
                        <div className="vbc h-full">
                            <AQUI.InputGroup>
                                <AQUI.FieldItem context={this} schema={this.schema} name="name" />
                                <AQUI.FieldItem context={this} schema={this.schema} name="abbr" />
                            </AQUI.InputGroup>
                            <AQUI.InputGroup>
                                <AQUI.FieldItem context={this} schema={this.schema} name="type" />
                                <AQUI.FieldItem context={this} schema={this.schema} name="country" />
                            </AQUI.InputGroup>
                        </div>
                    </AQUI.InputGroup>
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema} name="website" />
                    </AQUI.InputGroup>
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema} name="remark" />
                    </AQUI.InputGroup>
                    <div className="hbc">
                        <AQUI.FieldItem context={this} schema={this.schema} name="delete" />
                        <AQUI.FieldItem context={this} schema={this.schema} name="save" />
                    </div>
                </div>
                <Popup
                    context={this}
                    _key={this.state._id + "Delete Check"}
                    name="deleteDoubleCheck"
                    appKey={this.props.context.props.appKey}
                    title={`Delete ${this.state.name} checking`}
                    content={R.Str("CUSTOMER_DELETE_DC", { name: this.state.name })}
                    onCheck={this.handleDelete}
                />
            </>
        );
    }

    componentDidMount() {
        let customer = Collection("customers").findOne({ _id: this.props.id });
        this.setState(customer);
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.props, prevProps)) {
            this.componentDidMount();
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg }, dispatch);
}

function mapStateToProps(state) {
    return {
        db: state.db
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerBasicInfo);
