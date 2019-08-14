import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as AQUI from "../../components/Window/core";
import { R } from "./index";
import _ from "lodash";

import Window from "../../components/Window";
import { getCountryList } from "../../utils";

import { throwMsg } from "../../actions";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

class CustomerNew extends Component {
    state = {
        abbr: "",
        name: "",
        country: "",
        type: "",
        processing: false
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
        save: {
            title: R.Str("SAVE"),
            type: "button",
            onClick: e => {
                this.handleSave(e);
            },
            disabled: {
                $or: {
                    abbr: "$!valid",
                    name: "$!valid",
                    country: "$!valid",
                    type: "$!valid"
                }
            },
            noUpload: true
        }
    };

    handleSave = e => {
        this.setState({ processing: true });
        let packedData = AQUI.schemaDataPack(this.schema, this.state);
        packedData._id = new Mongo.ObjectID();
        Meteor.call("addCustomer", packedData, (err, res) => {
            this.setState({ processing: false });
            if (err) {
                this.props.throwMsg(R.Msg("SERVER_ERROR", err));
            } else {
                this.props.throwMsg(R.Msg("SAVED"));
                this.props.onClose();
            }
        });
    };

    render() {
        return (
            <Window
                onClose={this.props.onClose}
                key={R.Str("NEW_CUSTOMER")}
                _key={R.Str("NEW_CUSTOMER")}
                appKey={this.props.context.props.appKey}
                title={R.Str("NEW_CUSTOMER")}
                theme="light"
                escToClose
            >
                <div className="window-content-inner handle">
                    <AQUI.FieldItem context={this} schema={this.schema} name="name" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="abbr" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="type" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="country" />
                    <div className="hec">
                        <AQUI.FieldItem context={this} schema={this.schema} name="save" />
                    </div>
                </div>
            </Window>
        );
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
)(CustomerNew);
