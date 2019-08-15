import React, { Component } from "react";
import PropTypes from "prop-types";
import Window from "../../components/Window";
import { ResourceFeeder } from "../../resources_feeder";

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
        let tabs = [TAB_CUSTOMERS, TAB_PROVIDERS];
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
        return <ul>{sidebar}</ul>;
    };

    renderContent = () => {
        switch (this.state.selected) {
            case TAB_CUSTOMERS:
                return <Customers appKey={this.props.appKey} />;
            case TAB_PROVIDERS:
                return <div className="empty-page">PROVIDERS</div>;
            default:
                return <div className="empty-page">CRM</div>;
        }
    };

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                appKey="trumode.crm"
                _key="Main"
                width={1200}
                height={800}
                title={R.Trans(this.constructor.manifest.appName)}
                noTitlebar
                onClose={() => this.setState({ open: false })}
            >
                <div className="window-sidebar-container">
                    <div className="window-sidebar">{this.renderSidebar()}</div>
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

CustomerRelationshipManager.propTypes = {
    appKey: PropTypes.string.isRequired
};

export default CustomerRelationshipManager;
