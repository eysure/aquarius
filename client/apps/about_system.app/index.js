import React, { Component } from "react";
import * as UI from "@material-ui/core";
import clientConfig from "../../client_config.js";

import { ResourceFeeder } from "../../resources_feeder";
const R = new ResourceFeeder(
    require("./resources/strings"),
    require("./resources/messages")
);

import Window from "../../components/dialog";

class AboutSystem extends Component {
    static appStaticProps = {
        appName: ["About System", "关于系统"],
        icon: "/assets/apps/ramdac.svg"
    };

    state = {
        clientConfigOpen: false,
        serverConfigOpen: false
    };

    render() {
        return (
            <Window appProps={this.props.appProps} width={360}>
                <div className="window-content">
                    <h2>Trumode.app</h2>
                    <UI.Typography variant="caption">
                        {R.Str("VERSION") + ": " + clientConfig.version}
                    </UI.Typography>
                    <UI.Typography variant="caption">
                        {R.Str("COPY_RIGHT")}
                    </UI.Typography>
                </div>
            </Window>
        );
    }
}

export default AboutSystem;
