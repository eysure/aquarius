import React, { Component } from "react";
import PropTypes from "prop-types";
import Window from "../../components/Window";
import { ResourceFeeder } from "../../resources_feeder";
import { addCommand } from "../../components/cardinal";
import { Collection } from "../../utils";

export const TAB_CUSTOMERS = "TAB_CUSTOMERS";
export const TAB_SUPPLIERS = "TAB_SUPPLIERS";

import Customers from "./customers";
import Suppliers from "./suppliers";

export const R = new ResourceFeeder(require("./resources/strings").default, require("./resources/messages").default);

class CustomerRelationshipManager extends Component {
    state = {
        selected: TAB_CUSTOMERS,
        open: true
    };

    renderSidebar = () => {
        let tabs = [TAB_CUSTOMERS, TAB_SUPPLIERS];
        let sidebar = [];

        for (let tab of tabs) {
            sidebar.push(
                <li key={tab} className={this.state.selected == tab ? "active" : ""} onClick={() => this.setState({ selected: tab })}>
                    <i className="material-icons" style={{ marginRight: 16 }}>
                        {R.get(tab + "_ICON")}
                    </i>
                    {R.get(tab)}
                </li>
            );
        }
        return <ul>{sidebar}</ul>;
    };

    renderContent = () => {
        switch (this.state.selected) {
            case TAB_CUSTOMERS:
                return <Customers appKey={this.props.appKey} />;
            case TAB_SUPPLIERS:
                return <Suppliers appKey={this.props.appKey} />;
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
                title={R.trans(this.constructor.manifest.appName)}
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

    addCardinalCommands = () => {
        addCommand(
            "sup",
            Collection("suppliers")
                .find()
                .fetch(),
            { keys: ["name", "abbr"] },
            item => ({
                title: item.name,
                subtitle: item.abbr,
                onSelect: () => {
                    console.log("Supplier select: ", item);
                }
            }),
            {
                pinyinTokenized: true
            }
        );
    };
}

CustomerRelationshipManager.manifest = {
    appKey: "trumode.crm",
    appName: R.get("APP_NAME"),
    icon: "/assets/apps/photo_gallery.svg"
};

CustomerRelationshipManager.propTypes = {
    appKey: PropTypes.string.isRequired
};

export default CustomerRelationshipManager;
