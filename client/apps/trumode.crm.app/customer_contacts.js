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
import CustomerContactsDetail from "./customer_contacts_detail";
import CustomerContactsNew from "./customer_contacts_new";
import { R } from "./index";

class CustomerContacts extends Component {
    state = {
        data: [],
        renderedCustomerContactDetails: [],
        renderedNewCustomerContact: false
    };

    render() {
        return (
            <div className="h-full v-full">
                <div className="handle roof-toolbar">
                    <div className="hbc h-full">
                        <div className="hcc">
                            <button className="aqui-toolbar-btn" onClick={() => this.setState({ renderedNewCustomerContact: true })}>
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
                            this.openCustomerContact(row._id);
                        }}
                        rowContextMenu={e => {
                            e.preventDefault();
                        }}
                        sortBy="name"
                        asc={true}
                    />
                </div>
                {this.renderNewCustomerContact()}
                {this.renderCustomerContactDetails()}
            </div>
        );
    }

    renderNewCustomerContact = () => {
        if (!this.state.renderedNewCustomerContact) return;

        return (
            <CustomerContactsNew
                appKey={this.props.appKey}
                customerId={this.props.customerId}
                onClose={() => {
                    this.setState({ renderedNewCustomerContact: false });
                }}
            />
        );
    };

    renderCustomerContactDetails = () => {
        let windows = [];
        for (let customerContactId of this.state.renderedCustomerContactDetails) {
            windows.push(
                <CustomerContactsDetail
                    key={customerContactId._str}
                    appKey={this.props.appKey}
                    customerId={this.props.customerId}
                    customerContactId={customerContactId}
                    onClose={() => {
                        let ids = this.state.renderedCustomerContactDetails;
                        ids.splice(ids.indexOf(customerContactId), 1);
                        this.setState({ renderedCustomerContactDetails: ids });
                    }}
                />
            );
        }
        return windows;
    };

    openCustomerContact = customerContactId => {
        if (this.state.renderedCustomerContactDetails.includes(customerContactId)) {
            this.props.activateWindow(this.props.appKey, customerContactId._str);
        } else this.setState({ renderedCustomerContactDetails: [...this.state.renderedCustomerContactDetails, customerContactId] });
    };

    componentDidMount() {
        let customer_id = this.props.customerId;
        Tracker.autorun(() => {
            Meteor.subscribe("customerContacts", { customer_id });
            let data = Collection("customers_contacts")
                .find({ customer_id })
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
)(CustomerContacts);

CustomerContacts.propTypes = {
    appKey: PropTypes.string.isRequired,
    customerId: PropTypes.instanceOf(Mongo.ObjectID).isRequired,

    activateWindow: PropTypes.func
};
