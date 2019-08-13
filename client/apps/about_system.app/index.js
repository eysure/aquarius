import React, { Component } from "react";
import clientConfig from "../../client_config.js";

import { ResourceFeeder } from "../../resources_feeder";
const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));

import Window from "../../components/Window";

class AboutSystem extends Component {
    state = {
        open: true
    };

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                key="Main"
                _key="Main"
                y="20vh"
                appKey={this.props.appKey}
                canMaximize={false}
                canResize={false}
                onClose={e => this.setState({ open: false })}
                title={R.Trans(AboutSystem.manifest.appName)}
                noTitlebar
                escToClose
            >
                <div
                    className="handle"
                    style={{
                        padding: "64px 64px",
                        display: "flex",
                        flexDirection: "column",
                        height: "calc(100% - 128px)",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <img style={{ textAlign: "center", width: "240px", marginBottom: "16px" }} src="/assets/os_logo2.png" />
                    <p style={{ margin: "8px 0" }}>{R.Str("VERSION") + " " + clientConfig.version}</p>
                    <p style={{ margin: "8px 0" }}>{R.Str("COPY_RIGHT")}</p>
                </div>
            </Window>
        );
    }
}

AboutSystem.manifest = {
    appKey: "about_system",
    appName: ["About System", "关于系统"],
    icon: "/assets/apps/ramdac.svg"
};

export default AboutSystem;
