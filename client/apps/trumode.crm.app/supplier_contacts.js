import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { Tracker } from "meteor/tracker";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { activateWindow } from "../../actions";
import * as AQUI from "../../components/Window/core";
import { Collection } from "../../utils";
import SupplierContactsDetail from "./supplier_contacts_detail";
import SupplierContactsNew from "./supplier_contacts_new";
import { R } from "./index";

class SupplierContacts extends Component {
    state = {
        data: [],
        renderedSupplierContactDetails: [],
        renderedNewSupplierContact: false
    };

    render() {
        return (
            <div className="h-full v-full">
                <div className="handle roof-toolbar">
                    <div className="hbc h-full">
                        <div className="hcc">
                            <button className="aqui-toolbar-btn" onClick={() => this.setState({ renderedNewSupplierContact: true })}>
                                <i className="material-icons">person_add</i>
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{ height: "calc(100% - 38px)", overflow: "auto" }}>
                    <AQUI.Table
                        heads={["name", "role", "mobile", "email", "time_created", "time_modified", "remark"]}
                        headsHide={["time_created", "time_modified", "remark"]}
                        headsTranslator={R}
                        data={this.state.data}
                        dataTranslator={{
                            time_created: val => {
                                return new Date(val).toLocaleString();
                            },
                            time_modified: val => {
                                return new Date(val).toLocaleString();
                            }
                        }}
                        rowDoubleClick={(e, row) => {
                            this.openSupplierContact(row._id);
                        }}
                        rowContextMenu={e => {
                            e.preventDefault();
                        }}
                        sortBy="name"
                        asc={true}
                    />
                </div>
                {this.renderNewSupplierContact()}
                {this.renderSupplierContactDetails()}
            </div>
        );
    }

    renderNewSupplierContact = () => {
        if (!this.state.renderedNewSupplierContact) return;

        return (
            <SupplierContactsNew
                appKey={this.props.appKey}
                supplierId={this.props.supplierId}
                onClose={() => {
                    this.setState({ renderedNewSupplierContact: false });
                }}
            />
        );
    };

    renderSupplierContactDetails = () => {
        let windows = [];
        for (let supplierContactId of this.state.renderedSupplierContactDetails) {
            windows.push(
                <SupplierContactsDetail
                    key={supplierContactId._str}
                    appKey={this.props.appKey}
                    supplierId={this.props.supplierId}
                    supplierContactId={supplierContactId}
                    onClose={() => {
                        let ids = this.state.renderedSupplierContactDetails;
                        ids.splice(ids.indexOf(supplierContactId), 1);
                        this.setState({ renderedSupplierContactDetails: ids });
                    }}
                />
            );
        }
        return windows;
    };

    openSupplierContact = supplierContactId => {
        if (this.state.renderedSupplierContactDetails.includes(supplierContactId)) {
            this.props.activateWindow(this.props.appKey, supplierContactId._str);
        } else this.setState({ renderedSupplierContactDetails: [...this.state.renderedSupplierContactDetails, supplierContactId] });
    };

    componentDidMount() {
        let supplier_id = this.props.supplierId;
        Tracker.autorun(() => {
            Meteor.subscribe("supplierContacts", { supplier_id });
            let data = Collection("suppliers_contacts")
                .find({ supplier_id })
                .fetch();
            this.setState({ data });
        });
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ activateWindow }, dispatch);
}

function mapStateToProps(state) {
    return {
        db: state.db
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SupplierContacts);

SupplierContacts.propTypes = {
    appKey: PropTypes.string.isRequired,
    supplierId: PropTypes.instanceOf(Mongo.ObjectID).isRequired,

    activateWindow: PropTypes.func
};
