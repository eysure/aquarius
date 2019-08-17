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

class SupplierNew extends Component {
    state = {
        abbr: "",
        name: "",
        address: "",
        city: "",
        state: "",
        country: "CN",
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
        address: {
            title: R.get("address"),
            valid: {
                $regex: /.+/
            }
        },
        city: {
            title: R.get("city"),
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
            title: R.get("state"),
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
            title: R.get("country"),
            type: "select",
            options: getCountryList()
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
                    name: "$!valid"
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
        Meteor.call(
            "edit",
            {
                db: "suppliers",
                action: "insert",
                data: packedData
            },
            err => {
                this.setState({ processing: false });
                if (err) {
                    console.error(err);
                    this.props.throwMsg(R.get("SERVER_ERROR", err));
                } else {
                    this.props.throwMsg(R.get("SAVED"));
                    this.props.onClose();
                }
            }
        );
    };

    render() {
        return (
            <Window
                onClose={this.props.onClose}
                _key={R.get("NEW_SUPPLIER")}
                width={640}
                appKey={this.props.appKey}
                title={R.get("NEW_SUPPLIER")}
                theme="light"
                escToClose
            >
                <div className="window-content-inner handle">
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema} name="name" width="200%" />
                        <AQUI.FieldItem context={this} schema={this.schema} name="abbr" />
                    </AQUI.InputGroup>
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema} name="address" />
                    </AQUI.InputGroup>
                    <AQUI.InputGroup>
                        <AQUI.FieldItem context={this} schema={this.schema} name="city" />
                        <AQUI.FieldItem context={this} schema={this.schema} name="state" />
                        <AQUI.FieldItem context={this} schema={this.schema} name="country" />
                    </AQUI.InputGroup>
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
)(SupplierNew);

SupplierNew.propTypes = {
    appKey: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,

    throwMsg: PropTypes.func
};
