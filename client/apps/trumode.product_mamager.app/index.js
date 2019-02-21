import React, { Component } from "react";
import * as UI from "@material-ui/core";
import clientConfig from "../../client_config.js";

import { ResourceFeeder } from "../../resources_feeder";

import Window from "../../components/dialog";

class ProductManager extends Component {
    static appStaticProps = {
        appName: ["Product Manager", "产品管理"],
        icon: "/assets/apps/clothing_label.svg"
    };

    render() {
        return (
            <Window appProps={this.props.appProps} width={360}>
                <div className="window-content">
                    <h2>Empty App</h2>
                </div>
            </Window>
        );
    }
}

export default ProductManager;
