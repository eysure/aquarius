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
            <Window appProps={this.props.appProps} width={800} height={600}>
                <div className="window-content">
                    <div className="app-template-fill">
                        <img src={this.constructor.appStaticProps.icon} />
                        <h1>Customer Relationship Manager</h1>
                        <h2>Managing all company's relationships and interactions with customers and potential customers, as well as manufacturers.</h2>
                    </div>
                </div>
            </Window>
        );
    }
}

export default CustomerRelationshipManager;
