import React, { Component } from "react";
import { R } from "./index";
import _ from "lodash";

import Window from "../../components/Window";

export const TAB_CUSTOMER_BASIC_INFO = "TAB_CUSTOMER_BASIC_INFO";
export const TAB_CUSTOMER_CONTACTS = "TAB_CUSTOMER_CONTACTS";
export const TAB_CUSTOMER_ANALYZE = "TAB_CUSTOMER_ANALYZE";

import CustomerBasicInfo from "./customer_basic_info";
import CustomerContacts from "./customer_contacts";
import CustomerAnalyze from "./customer_analyze";

import { Collection } from "../../utils";
import { Mongo } from "meteor/mongo";
import PropTypes from "prop-types";

class CustomerDetail extends Component {
    state = {
        selected: TAB_CUSTOMER_BASIC_INFO,
        open: true
    };

    tabs = [TAB_CUSTOMER_BASIC_INFO, TAB_CUSTOMER_CONTACTS, TAB_CUSTOMER_ANALYZE];

    renderSidebar = () => {
        let sidebar = [];
        for (let tab of this.tabs) {
            sidebar.push(
                <li key={tab} className={this.state.selected == tab ? "active" : ""} onClick={() => this.setState({ selected: tab })}>
                    <i className="material-icons" style={{ marginRight: 16 }}>
                        {R.Str(tab + "_ICON")}
                    </i>
                    {R.Str(tab)}
                </li>
            );
        }
        return sidebar;
    };

    renderContent = () => {
        switch (this.state.selected) {
            case TAB_CUSTOMER_BASIC_INFO:
                return <CustomerBasicInfo appKey={this.props.appKey} customerId={this.props.customerId} onClose={this.props.onClose} />;
            case TAB_CUSTOMER_CONTACTS:
                return <CustomerContacts appKey={this.props.appKey} customerId={this.props.customerId} />;
            case TAB_CUSTOMER_ANALYZE:
                return <CustomerAnalyze appKey={this.props.appKey} customerId={this.props.customerId} />;
            default:
                return <div className="empty-page">Customer Detail</div>;
        }
    };

    render() {
        if (!this.state._id) return null;
        return (
            <Window
                onClose={this.props.onClose}
                key={this.props.customerId._str}
                _key={this.props.customerId._str}
                width={1000}
                height={700}
                appKey={this.props.appKey}
                title={this.state.name}
                theme="light"
                escToClose
            >
                <div className="window-sidebar-container">
                    <div className="window-sidebar">
                        <ul>{this.renderSidebar()}</ul>
                    </div>
                    <div className="window-sidebar-content">{this.renderContent()}</div>
                </div>
            </Window>
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

export default CustomerDetail;

CustomerDetail.propTypes = {
    appKey: PropTypes.string.isRequired,
    customerId: PropTypes.instanceOf(Mongo.ObjectID).isRequired,
    onClose: PropTypes.func.isRequired
};
