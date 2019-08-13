import React, { Component } from "react";
import * as UI from "@material-ui/core";
import clientConfig from "../../client_config.js";

import { ResourceFeeder } from "../../resources_feeder";

import Window from "../../components/Window";

class ProductManager extends Component {
    state = { open: true };

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                key="Main"
                _key="Main"
                width={800}
                height={600}
                appKey={this.props.appKey}
                title={"Producet Manger"}
                onClose={e => this.setState({ open: false })}
            >
                <div className="app-template-fill">
                    <img src={this.constructor.manifest.icon} />
                    <h1>Product Manager</h1>
                    <h2>Management of items sold by the company.</h2>
                </div>
            </Window>
        );
    }
}

ProductManager.manifest = {
    appKey: "trumode.product_manager",
    appName: ["Product Manager", "产品管理"],
    icon: "/assets/apps/clothing_label.svg"
};

export default ProductManager;
