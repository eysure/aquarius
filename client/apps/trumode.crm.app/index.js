import React, { Component } from "react";
import * as AQUI from "../../components/Window/core";
import { Meteor } from "meteor/meteor";
import clientConfig from "../../client_config.js";

import { ResourceFeeder } from "../../resources_feeder";

import Window from "../../components/Window";

export const TAB_CUSTOMERS = "TAB_CUSTOMERS";
export const TAB_PROVIDERS = "TAB_PROVIDERS";

import Customers from "./customers";

export const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));

class CustomerRelationshipManager extends Component {
    state = {
        selected: TAB_CUSTOMERS,
        open: true
    };

    renderSidebar = () => {
        let tabs = new Set();
        tabs.add(TAB_CUSTOMERS);
        tabs.add(TAB_PROVIDERS);

        let sidebar = [];
        for (let tab of tabs) {
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
            case TAB_CUSTOMERS:
                return <Customers />;
            case TAB_PROVIDERS:
                return <div className="empty-page">PROVIDERS</div>;
            default:
                return <div className="empty-page">CRM</div>;
        }
    };

    render() {
        if (!this.state.open) return null;
        return (
            <Window key="Main" _key="Main" width={1200} height={800} appKey={this.props.appKey} onClose={e => this.setState({ open: false })}>
                <div className="window-sidebar-container">
                    <div className="window-sidebar">
                        <ul>{this.renderSidebar()}</ul>
                    </div>
                    <div className="window-sidebar-content">{this.renderContent()}</div>
                </div>
            </Window>
        );
    }
}

CustomerRelationshipManager.manifest = {
    appKey: "trumode.crm",
    appName: ["CRM", "客户与供应商"],
    icon: "/assets/apps/photo_gallery.svg"
};

export default CustomerRelationshipManager;
