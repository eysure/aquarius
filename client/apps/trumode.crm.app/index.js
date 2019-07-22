import React, { Component } from "react";
import * as UI from "@material-ui/core";
import clientConfig from "../../client_config.js";

import { ResourceFeeder } from "../../resources_feeder";

import Window from "../../components/Window";

class CustomerRelationshipManager extends Component {
    state = { open: true };

    render() {
        if (!this.state.open) return null;
        return (
            <Window key="Main" _key="Main" width={800} height={600} appKey={this.props.appKey} titlebar={"CRM"} onClose={e => this.setState({ open: false })}>
                <div className="window-content">
                    <div className="app-template-fill">
                        <img src={this.constructor.manifest.icon} />
                        <h1>Customer Relationship Manager</h1>
                        <h2>Managing all company's relationships and interactions with customers and potential customers, as well as manufacturers.</h2>
                    </div>
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
