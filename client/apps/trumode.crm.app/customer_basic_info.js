import _ from "lodash";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { throwMsg } from "../../actions";
import * as AQUI from "../../components/Window/core";
import Popup from "../../components/Window/popup";
import { Collection, getCountryList, oss, upload } from "../../utils";
import { R } from "./index";
import { Mongo } from "meteor/mongo";

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
            title: R.get("logo"),
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
                        findOne: { _id: this.props.customerId },
                        field: "logo"
                    },
                    () => {
                        this.props.throwMsg(
                            R.get("FILE_UPLOADING", {
                                key: `CUSTOMER_LOGO_UPLOAD_${this.props.customerId._str}`
                            })
                        );
                    },
                    err => {
                        if (err) {
                            this.props.throwMsg(
                                R.get("SERVER_ERROR", {
                                    key: `CUSTOMER_LOGO_UPLOAD_${this.props.customerId._str}`,
                                    ...err
                                })
                            );
                        } else {
                            this.props.throwMsg(
                                R.get("FILE_UPLOADED", {
                                    key: `CUSTOMER_LOGO_UPLOAD_${this.props.customerId._str}`
                                })
                            );
                            return true;
                        }
                    }
                );
            }
        },
        abbr: {
            title: R.get("abbr"),
            valid: {
                $regex: /.+/
            }
        },
        name: {
            title: R.get("name"),
            valid: {
                $regex: /.+/
            }
        },
        country: {
            title: R.get("country"),
            type: "select",
            options: getCountryList()
        },
        type: {
            title: R.get("type"),
            type: "select",
            options: {
                "0": R.get("type_0"),
                "1": R.get("type_1"),
                "2": R.get("type_2"),
                "3": R.get("type_3"),
                "4": R.get("type_4")
            }
        },
        website: {
            title: R.get("website")
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
                    abbr: "$!valid",
                    name: "$!valid",
                    country: "$!valid",
                    type: "$!valid",
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

    handleSave = () => {
        this.setState({ processing: true });
        let packedData = AQUI.schemaDataPack(this.schema, this.state);
        packedData._id = this.state._id;
        Meteor.call("editCustomer", packedData, err => {
            this.setState({ processing: false });
            if (err) {
                this.props.throwMsg(R.get("SERVER_ERROR", err));
            } else {
                this.props.throwMsg(R.get("SAVED"));
            }
        });
    };

    handleDelete = () => {
        Meteor.call("deleteCustomer", this.state._id, err => {
            this.setState({ processing: false });
            if (err) {
                this.props.throwMsg(R.get("SERVER_ERROR", err));
            } else {
                this.props.throwMsg(R.get("DELETED"));
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
                    appKey={this.props.appKey}
                    title={`Delete ${this.state.name} checking`}
                    content={R.get("CUSTOMER_DELETE_DC", { name: this.state.name })}
                    onCheck={this.handleDelete}
                />
            </>
        );
    }

    componentDidMount() {
        let customer = Collection("customers").findOne({ _id: this.props.customerId });
        this.setState(customer);
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props, prevProps)) {
            this.componentDidMount();
        }
    }
}

function mapStateToProps(state) {
    return {
        db: state.db
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerBasicInfo);

CustomerBasicInfo.propTypes = {
    appKey: PropTypes.string.isRequired,
    customerId: PropTypes.instanceOf(Mongo.ObjectID).isRequired,
    onClose: PropTypes.func.isRequired,

    throwMsg: PropTypes.func
};
