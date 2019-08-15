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

class CustomerContactsNew extends Component {
    state = {
        customer_id: "",
        name: "",
        role: "",
        mobile: "",
        email: "",
        remark: "",
        processing: false,
        customersOptions: {}
    };

    schema = () => {
        return {
            customer_id: {
                title: R.Str("customer_id"),
                type: "select",
                options: this.state.customersOptions
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
            }
        };
    };

    handleSave = () => {
        this.setState({ processing: true });
        let packedData = AQUI.schemaDataPack(this.schema(), this.state);
        packedData._id = new Mongo.ObjectID();
        packedData.customer_id = new Mongo.ObjectID(packedData.customer_id);
        Meteor.call(
            "edit",
            {
                db: "customers_contacts",
                action: "insert",
                data: packedData
            },
            err => {
                this.setState({ processing: false });
                if (err) {
                    this.props.throwMsg(R.Msg("SERVER_ERROR", err));
                } else {
                    this.props.throwMsg(R.Msg("SAVED"));
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
                key={R.Str("NEW_CUSTOMER_CONTACT")}
                _key={R.Str("NEW_CUSTOMER_CONTACT")}
                appKey={this.props.appKey}
                title={R.Str("NEW_CUSTOMER_CONTACT")}
                theme="light"
                escToClose
            >
                <div className="window-content-inner handle">
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={schema} name="customer_id" />
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
        this.setState({ customer_id: this.props.customerId._str });

        let customers = Collection("customers")
            .find()
            .fetch();
        let customersOptions = {};
        for (let cus of customers) {
            customersOptions[cus._id._str] = `${cus.abbr} - ${cus.name}`;
        }
        this.setState({ customersOptions });
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
)(CustomerContactsNew);

CustomerContactsNew.propTypes = {
    appKey: PropTypes.string.isRequired,
    customerId: PropTypes.instanceOf(Mongo.ObjectID).isRequired,
    onClose: PropTypes.func.isRequired,

    throwMsg: PropTypes.func
};
