import _ from "lodash";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { throwMsg } from "../../actions";
import Window from "../../components/Window";
import * as AQUI from "../../components/Window/core";
import Popup from "../../components/Window/popup";
import { Collection, oss, upload } from "../../utils";
import { R } from "./index";
import PropTypes from "prop-types";

class SupplierContactsDetail extends Component {
    state = {
        supplier_id: "",
        _id: "",
        photo: "",
        name: "",
        mobile: "",
        email: "",
        role: "",
        remark: "",
        processing: false,
        deleteDoubleCheck: false,
        modified: false,
        suppliersOptions: {}
    };

    schema = () => {
        return {
            supplier_id: {
                title: R.get("supplier_id"),
                type: "select",
                options: this.state.suppliersOptions
            },
            photo: {
                title: R.get("photo"),
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
                            db: "suppliers_contacts",
                            findOne: { _id: this.props.supplierContactId },
                            field: "photo"
                        },
                        () => {
                            this.props.throwMsg(
                                R.get("FILE_UPLOADING", {
                                    key: `SUPPLIER_CONTACT_IMAGE_UPLOAD_${this.props.supplierContactId._str}`
                                })
                            );
                        },
                        err => {
                            if (err) {
                                this.props.throwMsg(
                                    R.get("SERVER_ERROR", {
                                        key: `SUPPLIER_CONTACT_IMAGE_UPLOAD_${this.props.supplierContactId._str}`,
                                        ...err
                                    })
                                );
                            } else {
                                this.props.throwMsg(
                                    R.get("FILE_UPLOADED", {
                                        key: `SUPPLIER_CONTACT_IMAGE_UPLOAD_${this.props.supplierContactId._str}`
                                    })
                                );
                                return true;
                            }
                        }
                    );
                }
            },
            name: {
                title: R.get("name"),
                valid: {
                    $regex: /.+/
                }
            },
            mobile: {
                title: R.get("mobile"),
                valid: {
                    $regex: /.+/
                }
            },
            email: {
                title: R.get("email"),
                valid: {
                    $regex: /.+/
                }
            },
            role: {
                title: R.get("role"),
                valid: {
                    $regex: /.+/
                }
            },
            remark: {
                title: R.get("remark"),
                type: "textarea",
                placeholder: R.get("remark")
            },
            save: {
                title: R.get("SAVE"),
                type: "button",
                disabled: {
                    $or: {
                        name: "$!valid",
                        modified: false
                    }
                },
                onClick: e => {
                    this.handleSave(e);
                },
                callByEnter: true
            },
            delete: {
                title: R.get("DELETE"),
                type: "button",
                onClick: () => {
                    this.setState({ deleteDoubleCheck: true });
                }
            }
        };
    };

    handleSave = () => {
        this.setState({ processing: true });
        let packedData = AQUI.schemaDataPack(this.schema(), this.state);
        packedData._id = this.state._id;
        if (!_.isObject(packedData.supplier_id)) packedData.supplier_id = new Mongo.ObjectID(packedData.supplier_id);
        Meteor.call(
            "edit",
            {
                db: "suppliers_contacts",
                findOne: { _id: this.state._id },
                action: "update",
                data: packedData
            },
            err => {
                this.setState({ processing: false });
                if (err) {
                    this.props.throwMsg(R.get("SERVER_ERROR", err));
                } else {
                    this.props.throwMsg(R.get("SAVED"));
                }
            }
        );
    };

    handleDelete = () => {
        this.setState({ processing: true });
        Meteor.call(
            "edit",
            {
                db: "suppliers_contacts",
                findOne: { _id: this.state._id },
                action: "delete"
            },
            err => {
                this.setState({ processing: false });
                if (err) {
                    this.props.throwMsg(R.get("SERVER_ERROR", err));
                } else {
                    this.props.throwMsg(R.get("DELETED"));
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
                appKey={this.props.appKey}
                title={this.state.name}
                escToClose
            >
                <div className="window-content-inner handle">
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema()} name="supplier_id" />
                    </AQUI.InputGroup>
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema()} name="photo" width="auto" />
                        <div className="vbc h-full">
                            <AQUI.InputGroup>
                                <AQUI.FieldItem context={this} schema={this.schema()} name="name" />
                                <AQUI.FieldItem context={this} schema={this.schema()} name="role" />
                            </AQUI.InputGroup>
                            <AQUI.InputGroup>
                                <AQUI.FieldItem context={this} schema={this.schema()} name="mobile" />
                            </AQUI.InputGroup>
                            <AQUI.InputGroup>
                                <AQUI.FieldItem context={this} schema={this.schema()} name="email" />
                            </AQUI.InputGroup>
                        </div>
                    </AQUI.InputGroup>
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema()} name="remark" />
                    </AQUI.InputGroup>
                    <div className="hbc">
                        <AQUI.FieldItem context={this} schema={this.schema()} name="delete" />
                        <AQUI.FieldItem context={this} schema={this.schema()} name="save" />
                    </div>
                </div>
                <Popup
                    context={this}
                    _key={this.state._id + "Delete Check"}
                    name="deleteDoubleCheck"
                    appKey={this.props.appKey}
                    title={`Delete ${this.state.name} checking`}
                    content={R.get("SUPPLIER_CONTACT_DELETE_DC", { name: this.state.name })}
                    onCheck={this.handleDelete}
                />
            </Window>
        );
    }

    componentDidMount() {
        let contact = Collection("suppliers_contacts").findOne({ _id: this.props.supplierContactId });
        let suppliers = Collection("suppliers")
            .find()
            .fetch();
        let suppliersOptions = {};
        for (let cus of suppliers) {
            suppliersOptions[cus._id._str] = `${cus.abbr} - ${cus.name}`;
        }
        this.setState({ suppliersOptions, ...contact });
    }

    componentDidUpdate(prevProps) {
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
)(SupplierContactsDetail);

SupplierContactsDetail.propTypes = {
    appKey: PropTypes.string.isRequired,
    supplierId: PropTypes.instanceOf(Mongo.ObjectID).isRequired,
    supplierContactId: PropTypes.instanceOf(Mongo.ObjectID).isRequired,
    onClose: PropTypes.func.isRequired,

    throwMsg: PropTypes.func
};
