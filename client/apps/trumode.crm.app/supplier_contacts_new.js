import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { throwMsg } from "../../actions";
import Window from "../../components/Window";
import * as AQUI from "../../components/Window/core";
import { Collection } from "../../utils";
import { R } from "./index";

class SupplierContactsNew extends Component {
    state = {
        supplier_id: "",
        name: "",
        role: "",
        mobile: "",
        email: "",
        remark: "",
        processing: false,
        suppliersOptions: {}
    };

    schema = () => {
        return {
            supplier_id: {
                title: R.get("supplier_id"),
                type: "select",
                options: this.state.suppliersOptions
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
            }
        };
    };

    handleSave = () => {
        this.setState({ processing: true });
        let packedData = AQUI.schemaDataPack(this.schema(), this.state);
        packedData._id = new Mongo.ObjectID();
        packedData.supplier_id = new Mongo.ObjectID(packedData.supplier_id);
        Meteor.call(
            "edit",
            {
                db: "suppliers_contacts",
                action: "insert",
                data: packedData
            },
            err => {
                this.setState({ processing: false });
                if (err) {
                    this.props.throwMsg(R.get("SERVER_ERROR", err));
                } else {
                    this.props.throwMsg(R.get("SAVED"));
                    this.props.onClose();
                }
            }
        );
    };

    render() {
        let schema = this.schema();

        return (
            <Window
                onClose={this.props.onClose}
                key={R.get("NEW_SUPPLIER_CONTACT")}
                _key={R.get("NEW_SUPPLIER_CONTACT")}
                appKey={this.props.appKey}
                title={R.get("NEW_SUPPLIER_CONTACT")}
                escToClose
            >
                <div className="window-content-inner handle">
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={schema} name="supplier_id" />
                    </AQUI.InputGroup>
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={schema} name="name" />
                        <AQUI.FieldItem context={this} schema={schema} name="role" />
                    </AQUI.InputGroup>
                    <AQUI.FieldItem context={this} schema={schema} name="mobile" />
                    <AQUI.FieldItem context={this} schema={schema} name="email" />
                    <AQUI.FieldItem context={this} schema={schema} name="remark" />
                    <div className="hec">
                        <AQUI.FieldItem context={this} schema={schema} name="save" />
                    </div>
                </div>
            </Window>
        );
    }

    componentDidMount() {
        this.setState({ supplier_id: this.props.supplierId._str });

        let suppliers = Collection("suppliers")
            .find()
            .fetch();
        let suppliersOptions = {};
        for (let cus of suppliers) {
            suppliersOptions[cus._id._str] = `${cus.abbr} - ${cus.name}`;
        }
        this.setState({ suppliersOptions });
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
)(SupplierContactsNew);

SupplierContactsNew.propTypes = {
    appKey: PropTypes.string.isRequired,
    supplierId: PropTypes.instanceOf(Mongo.ObjectID).isRequired,
    onClose: PropTypes.func.isRequired,

    throwMsg: PropTypes.func
};
