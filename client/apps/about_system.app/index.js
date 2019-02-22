import React, { Component } from "react";
import * as UI from "@material-ui/core";
import clientConfig from "../../client_config.js";

import { ResourceFeeder } from "../../resources_feeder";
const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));

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
            <Window appProps={this.props.appProps} width={360} titleBarStyle="fusion" className="handle">
                <div
                    style={{
                        padding: "64px 32px",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <img style={{ textAlign: "center", width: "240px", marginBottom: "16px" }} src="/assets/os_logo2.png" />
                    <UI.Typography variant="caption">{R.Str("VERSION") + " " + clientConfig.version}</UI.Typography>
                    <UI.Typography variant="caption">{R.Str("COPY_RIGHT")}</UI.Typography>
                </div>
            </Window>
        );
    }
}

export default AboutSystem;
