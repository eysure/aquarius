import _ from "lodash";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { throwMsg } from "../../actions";
import * as AQUI from "../../components/Window/core";
import Popup from "../../components/Window/popup";
import { Collection, getCountryList } from "../../utils";
import { R } from "./index";

class SupplierBasicInfo extends Component {
    state = {
        _id: "",
        abbr: "",
        name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        website: "",
        tel: "",
        fax: "",
        email: "",
        remark: "",
        processing: false,
        deleteDoubleCheck: false,
        modified: false
    };

    schema = {
        abbr: {
            title: R.Str("abbr"),
            valid: {
                $regex: /.+/
            },
            placeholder: R.Str("ABBR_PH")
        },
        name: {
            title: R.Str("name"),
            valid: {
                $regex: /.+/
            },
            placeholder: R.Str("NAME_PH")
        },
        address: {
            title: R.Str("address"),
            valid: {
                $regex: /.+/
            }
        },
        city: {
            title: R.Str("city"),
            valid: {
                $regex: /.+/
            },
            disabled: {
                country: {
                    $neq: "CN"
                }
            }
        },
        state: {
            title: R.Str("state"),
            valid: {
                $regex: /.+/
            },
            disabled: {
                country: {
                    $neq: "CN"
                }
            }
        },
        country: {
            title: R.Str("country"),
            type: "select",
            options: getCountryList()
        },
        website: {
            title: R.Str("website")
        },
        email: {
            title: R.Str("email"),
            type: "email"
        },
        tel: {
            title: R.Str("tel")
        },
        fax: {
            title: R.Str("fax")
        },
        remark: {
            title: R.Str("remark"),
            type: "textarea",
            placeholder: R.Str("remark")
        },
        save: {
            title: R.Str("SAVE"),
            type: "button",
            onClick: e => {
                this.handleSave(e);
            },
            disabled: {
                $or: {
                    abbr: "$!valid",
                    name: "$!valid"
                }
            },
            noUpload: true
        },
        delete: {
            title: R.Str("DELETE"),
            type: "button",
            onClick: () => {
                this.setState({ deleteDoubleCheck: true });
            }
        }
    };

    handleSave = () => {
        this.setState({ processing: true });
        let packedData = AQUI.schemaDataPack(this.schema, this.state);
        Meteor.call(
            "edit",
            {
                db: "suppliers",
                action: "update",
                findOne: { _id: this.props.supplierId },
                data: packedData
            },
            err => {
                this.setState({ processing: false });
                if (err) {
                    this.props.throwMsg(R.Msg("SERVER_ERROR", err));
                } else {
                    this.props.throwMsg(R.Msg("SAVED"));
                }
            }
        );
    };

    handleDelete = () => {
        Meteor.call("deleteSupplier", this.state._id, err => {
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
                        <AQUI.FieldItem context={this} schema={this.schema} name="name" width="200%" />
                        <AQUI.FieldItem context={this} schema={this.schema} name="abbr" />
                    </AQUI.InputGroup>
                    <AQUI.FieldItem context={this} schema={this.schema} name="address" />
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema} name="city" />
                        <AQUI.FieldItem context={this} schema={this.schema} name="state" />
                        <AQUI.FieldItem context={this} schema={this.schema} name="country" />
                    </AQUI.InputGroup>
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema} name="tel" />
                        <AQUI.FieldItem context={this} schema={this.schema} name="fax" />
                        <AQUI.FieldItem context={this} schema={this.schema} name="email" />
                    </AQUI.InputGroup>
                    <AQUI.FieldItem context={this} schema={this.schema} name="website" />
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
                    content={R.Str("SUPPLIER_DELETE_DC", { name: this.state.name })}
                    onCheck={this.handleDelete}
                />
            </>
        );
    }

    componentDidMount() {
        let supplier = Collection("suppliers").findOne({ _id: this.props.supplierId });
        this.setState(supplier);
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
)(SupplierBasicInfo);

SupplierBasicInfo.propTypes = {
    appKey: PropTypes.string.isRequired,
    supplierId: PropTypes.instanceOf(Mongo.ObjectID).isRequired,
    onClose: PropTypes.func.isRequired,

    throwMsg: PropTypes.func
};
