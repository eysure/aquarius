import React, { Component } from "react";
import { R } from "./index";
import _ from "lodash";

import Window from "../../components/Window";

export const TAB_SUPPLIER_BASIC_INFO = "TAB_SUPPLIER_BASIC_INFO";
export const TAB_SUPPLIER_CONTACTS = "TAB_SUPPLIER_CONTACTS";
export const TAB_SUPPLIER_ANALYZE = "TAB_SUPPLIER_ANALYZE";

import SupplierBasicInfo from "./supplier_basic_info";
import SupplierContacts from "./supplier_contacts";
import SupplierAnalyze from "./supplier_analyze";

import { Collection } from "../../utils";
import { Mongo } from "meteor/mongo";
import PropTypes from "prop-types";

class SupplierDetail extends Component {
    state = {
        selected: TAB_SUPPLIER_BASIC_INFO,
        open: true
    };

    tabs = [TAB_SUPPLIER_BASIC_INFO, TAB_SUPPLIER_CONTACTS, TAB_SUPPLIER_ANALYZE];

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
            case TAB_SUPPLIER_BASIC_INFO:
                return <SupplierBasicInfo appKey={this.props.appKey} supplierId={this.props.supplierId} onClose={this.props.onClose} />;
            case TAB_SUPPLIER_CONTACTS:
                return <SupplierContacts appKey={this.props.appKey} supplierId={this.props.supplierId} />;
            case TAB_SUPPLIER_ANALYZE:
                return <SupplierAnalyze appKey={this.props.appKey} supplierId={this.props.supplierId} />;
            default:
                return <div className="empty-page">Supplier Detail</div>;
        }
    };

    render() {
        if (!this.state._id) return null;
        return (
            <Window
                onClose={this.props.onClose}
                key={this.props.supplierId._str}
                _key={this.props.supplierId._str}
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
        let supplier = Collection("suppliers").findOne({ _id: this.props.supplierId });
        this.setState(supplier);
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props, prevProps)) {
            this.componentDidMount();
        }
    }
}

export default SupplierDetail;

SupplierDetail.propTypes = {
    appKey: PropTypes.string.isRequired,
    supplierId: PropTypes.instanceOf(Mongo.ObjectID).isRequired,
    onClose: PropTypes.func.isRequired
};
