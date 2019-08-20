import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { throwMsg } from "../../actions";
import Window from "../../components/Window";
import * as AQUI from "../../components/Window/core";
import { getCountryList } from "../../utils";
import { R } from "./index";

class CustomerNew extends Component {
    state = {
        abbr: "",
        name: "",
        country: "",
        type: "",
        remark: "",
        processing: false
    };

    schema = {
        abbr: {
            title: R.get("abbr"),
            valid: {
                $regex: /.+/
            },
            placeholder: R.get("ABBR_PH")
        },
        name: {
            title: R.get("name"),
            valid: {
                $regex: /.+/
            },
            placeholder: R.get("NAME_PH")
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
                0: R.get("type_0"),
                1: R.get("type_1"),
                2: R.get("type_2"),
                3: R.get("type_3"),
                4: R.get("type_4")
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
            noUpload: true,
            callByEnter: true
        }
    };

    handleSave = () => {
        this.setState({ processing: true });
        let packedData = AQUI.schemaDataPack(this.schema, this.state);
        packedData._id = new Mongo.ObjectID();
        Meteor.call("addCustomer", packedData, err => {
            this.setState({ processing: false });
            if (err) {
                console.log(err);
                this.props.throwMsg(R.get("SERVER_ERROR", err));
            } else {
                this.props.throwMsg(R.get("SAVED"));
                this.props.onClose();
            }
        });
    };

    render() {
        return (
            <Window onClose={this.props.onClose} _key={R.get("NEW_CUSTOMER")} appKey={this.props.appKey} width={480} title={R.get("NEW_CUSTOMER")} escToClose>
                <div className="window-content-inner handle">
                    <AQUI.FieldItem context={this} schema={this.schema} name="name" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="abbr" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="type" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="country" />
                    <AQUI.FieldItem context={this} schema={this.schema} name="remark" />
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

CustomerNew.propTypes = {
    appKey: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,

    throwMsg: PropTypes.func
};
