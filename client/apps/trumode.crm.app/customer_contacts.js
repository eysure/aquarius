import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Mongo } from "meteor/mongo";

import { R } from "./index";
import * as AQUI from "../../components/Window/core";
import { activateWindow } from "../../actions";

import CustomerContactsDetail from "./customer_contacts_detail";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { Collection } from "../../utils";

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
                            <button className="roof-toolbar-btn material-icons" onClick={e => this.setState({ renderedNewCustomer: true })}>
                                person_add
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{ height: "calc(100% - 38px)", overflow: "auto" }}>
                    <AQUI.Table
                        heads={["name", "role", "mobile", "email", "time_created", "time_modified"]}
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
                        rowContextMenu={(e, row) => {
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

        let id = new Mongo.ObjectID();
        return (
            // <CustomerNew
            //     key={id._str}
            //     context={this.props.context}
            //     id={id}
            //     onClose={e => {
            //         this.setState({ renderedNewCustomer: false });
            //     }}
            // />
            null
        );
    };

    renderCustomerContactDetails = () => {
        let windows = [];
        for (let id of this.state.renderedCustomerContactDetails) {
            windows.push(
                <CustomerContactsDetail
                    key={id._str}
                    context={this.props.context}
                    id={id}
                    onClose={e => {
                        let ids = this.state.renderedCustomerContactDetails;
                        ids.splice(ids.indexOf(id), 1);
                        this.setState({ renderedCustomerContactDetails: ids });
                    }}
                />
            );
        }
        return windows;
    };

    openCustomerContact = id => {
        if (this.state.renderedCustomerContactDetails.includes(id)) {
            this.props.activateWindow(this.props.context.props.appKey, id._str);
        } else this.setState({ renderedCustomerContactDetails: [...this.state.renderedCustomerContactDetails, id] });
    };

    componentDidMount() {
        let customer_id = this.props.id;
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
