import React, { Component } from "react";
import * as UI from "@material-ui/core";
import clientConfig from "../../client_config.js";

import { ResourceFeeder } from "../../resources_feeder";
const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));

import Window from "../../components/dialog";

class Manual extends Component {
    static appStaticProps = {
        appName: ["Manual", "使用手册"],
        icon: "/assets/apps/brochure.svg"
    };

    render() {
        return (
            <Window appProps={this.props.appProps} width={"40vmin"} height={"60vmin"}>
                <div className="window-content">
                    <div className="app-template-fill">
                        <img src={this.constructor.appStaticProps.icon} />
                        <h1>Manual</h1>
                        <h2>Guiding user through using this system, as well as internal apps.</h2>
                    </div>
                </div>
            </Window>
        );
    }
}

export default Manual;
