import React, { Component } from "react";
import Window from "../../components/Window";
import { ResourceFeeder } from "../../resources_feeder";

const R = new ResourceFeeder(require("./resources/strings").default, null);

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
    appName: R.get("APP_NAME"),
    icon: "/assets/apps/clothing_label.svg"
};

export default ProductManager;
