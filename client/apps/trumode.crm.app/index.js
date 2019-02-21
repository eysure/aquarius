import React, { Component } from "react";
import * as UI from "@material-ui/core";
import clientConfig from "../../client_config.js";

import { ResourceFeeder } from "../../resources_feeder";

import Window from "../../components/dialog";

class CustomerRelationshipManager extends Component {
    static appStaticProps = {
        appName: ["CRM", "客户与供应商"],
        icon: "/assets/apps/photo_gallery.svg"
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

export default CustomerRelationshipManager;
