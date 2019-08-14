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

class CustomerContactsDetail extends Component {
    state = {
        _id: "",
        photo: "",
        name: "",
        mobile: "",
        email: "",
        role: "",
        remark: "",
        processing: false,
        deleteDoubleCheck: false,
        modified: false
    };

    schema = {
        photo: {
            title: R.Str("photo"),
            type: "image",
            style: {
                width: 191,
                height: 191
            },
            srcTranslator: val => oss(val),
            handleDrop: files => {
                upload(
                    files[0],
                    {
                        db: "customers_contacts",
                        findOne: { _id: this.props.id },
                        field: "photo"
                    },
                    () => {
                        this.props.throwMsg(
                            R.Msg("FILE_UPLOADING", {
                                key: `CUSTOMER_CONTACT_IMAGE_UPLOAD_${this.props.id._str}`
                            })
                        );
                    },
                    (err, res) => {
                        if (err) {
                            this.props.throwMsg(
                                R.Msg("SERVER_ERROR", {
                                    key: `CUSTOMER_CONTACT_IMAGE_UPLOAD_${this.props.id._str}`,
                                    ...err
                                })
                            );
                            console.error(err);
                        } else {
                            console.log(res);
                            this.props.throwMsg(
                                R.Msg("FILE_UPLOADED", {
                                    key: `CUSTOMER_CONTACT_IMAGE_UPLOAD_${this.props.id._str}`
                                })
                            );
                            return true;
                        }
                    }
                );
            }
        },
        name: {
            title: R.Str("name"),
            valid: {
                $regex: /.+/
            }
        },
        mobile: {
            title: R.Str("mobile"),
            valid: {
                $regex: /.+/
            }
        },
        email: {
            title: R.Str("email"),
            valid: {
                $regex: /.+/
            }
        },
        role: {
            title: R.Str("role"),
            valid: {
                $regex: /.+/
            }
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
                    name: "$!valid",
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
        Meteor.call(
            "edit",
            {
                db: "customers_contacts",
                findOne: { _id: this.state._id },
                action: "update",
                data: packedData
            },
            (err, res) => {
                this.setState({ processing: false });
                if (err) {
                    this.props.throwMsg(R.Msg("SERVER_ERROR", err));
                } else {
                    this.props.throwMsg(R.Msg("SAVED"));
                }
            }
        );
    };

    handleDelete = e => {
        this.setState({ processing: true });
        Meteor.call(
            "edit",
            {
                db: "customers_contacts",
                findOne: { _id: this.state._id },
                action: "delete"
            },
            (err, res) => {
                this.setState({ processing: false });
                if (err) {
                    this.props.throwMsg(R.Msg("SERVER_ERROR", err));
                } else {
                    this.props.throwMsg(R.Msg("DELETED"));
                    this.props.onClose();
                }
            }
        );
    };

    render() {
        if (!this.state._id) return null;
        return (
            <Window
                onClose={this.props.onClose}
                key={this.state._id._str}
                _key={this.state._id._str}
                width={600}
                appKey={this.props.context.props.appKey}
                title={this.state.name}
                theme="light"
                escToClose
            >
                <div className="window-content-inner handle">
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema} name="photo" width="auto" />
                        <div className="vbc h-full">
                            <AQUI.InputGroup>
                                <AQUI.FieldItem context={this} schema={this.schema} name="name" />
                                <AQUI.FieldItem context={this} schema={this.schema} name="role" />
                            </AQUI.InputGroup>
                            <AQUI.InputGroup>
                                <AQUI.FieldItem context={this} schema={this.schema} name="mobile" />
                            </AQUI.InputGroup>
                            <AQUI.InputGroup>
                                <AQUI.FieldItem context={this} schema={this.schema} name="email" />
                            </AQUI.InputGroup>
                        </div>
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
                    content={R.Str("CUSTOMER_CONTACT_DELETE_DC", { name: this.state.name })}
                    onCheck={this.handleDelete}
                />
            </Window>
        );
    }

    componentDidMount() {
        let contact = Collection("customers_contacts").findOne({ _id: this.props.id });
        this.setState(contact);
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
)(CustomerContactsDetail);
