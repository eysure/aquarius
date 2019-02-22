import React, { Component } from "react";
import * as UI from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { appClose } from "../../actions";

import { ResourceFeeder } from "../../resources_feeder";
const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));
import SwipeableViews from "react-swipeable-views";

import Window from "../../components/dialog";
import { Divider } from "@material-ui/core";

class Welcome extends Component {
    state = { index: 0 };
    static appStaticProps = {
        appName: ["Welcome", "欢迎"],
        icon: "/assets/apps/cardiology.svg"
    };

    render() {
        return (
            <Window
                appProps={this.props.appProps}
                width={"80vmin"}
                height={"60vmin"}
                titleBarStyle={"fusion"}
                className="handle"
                style={{ minWidth: 800, minHeight: 600 }}
            >
                <SwipeableViews
                    id="welcome-carousel"
                    className="carousel"
                    resistance
                    index={this.state.index}
                    onChangeIndex={index => this.setState({ index })}
                >
                    {this.pages}
                </SwipeableViews>
                <div className="carousel-ctrl">
                    <button
                        style={{ opacity: this.state.index === 0 ? 0 : 1 }}
                        onClick={() => {
                            this.setState({ index: Math.max(0, this.state.index - 1) });
                        }}
                    >
                        <i className="material-icons">keyboard_arrow_left</i>
                    </button>
                    <button
                        style={{ opacity: this.pages.length === this.state.index + 1 ? 0 : 1 }}
                        onClick={() => {
                            this.setState({ index: Math.min(this.pages.length - 1, this.state.index + 1) });
                        }}
                    >
                        <i className="material-icons">keyboard_arrow_right</i>
                    </button>
                </div>
            </Window>
        );
    }

    pages = [
        <div key="welcome-page-1" className="page">
            <img style={{ height: "40%", position: "absolute", bottom: 0 }} src="/assets/apps/aquarius.svg" />
            <div style={{ position: "absolute", top: "35%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>Welcome to AquariusOS</h1>
                <h2 style={{ fontWeight: 100, marginTop: 0 }}>Demo version</h2>
            </div>
        </div>,
        <div key="welcome-page-2" className="page">
            <div>
                <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>AquariusOS is...</h1>
                <Divider />
                <ul style={{ padding: 32, fontSize: "1.5rem", fontWeight: 300 }}>
                    <li>A cool desktop envrionment running just in your browser</li>
                    <li>Designed for complex enterprise systems</li>
                    <li>Fully customizable for every application</li>
                    <li>Secure and fast, in every aspect</li>
                    <li>Developed with love by Xinyang Zhu</li>
                </ul>
            </div>
        </div>,
        <div key="welcome-page-3" className="page">
            <img style={{ width: "20%" }} src="/assets/apps/rocket.svg" />
            <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>Use Launchpad to launch an app</h2>
        </div>,
        <div key="welcome-page-4" className="page">
            <img style={{ width: "100%", position: "absolute", bottom: 0 }} src="/assets/guide/window_ctrl.png" />
            <h2 style={{ fontSize: "2rem", marginBottom: "30%" }}>Full window control</h2>
        </div>,
        <div key="welcome-page-5" className="page">
            <img style={{ width: "100%", position: "absolute", bottom: 0 }} src="/assets/guide/dnd.png" />
            <h2 style={{ fontSize: "2rem", marginBottom: "30%" }}>Drag and drop to change desktop, avatars and more!</h2>
        </div>,
        <div key="welcome-page-6" className="page">
            <div style={{ height: "100%", padding: "32px 64px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <span style={{ fontSize: "8rem" }}>👨🏻‍💻</span>
                <h1 style={{ fontSize: "2rem" }}>And more cool features are comming soon!</h1>
                <UI.Button
                    variant="outlined"
                    color="primary"
                    style={{ width: "50%", margin: "32px" }}
                    onClick={e => this.props.appClose(this.props.appProps.key)}
                >
                    Enjoy
                </UI.Button>
                <p style={{ fontSize: "1rem", fontWeight: 300, width: "80%", position: "absolute", bottom: "32px", color: "grey" }}>
                    Please understand that this system is still developing and maintaining. Bugs and crashes may occur during the demo. If you have any advice
                    or feekback, feel free to open an issue, or send me an email at eysure@gmail.com. Thanks for all your cooperation.
                </p>
                <div className="sm-list">
                    <a href="mailto:eysure@gmail.com">
                        <i className="sm-icons">k</i>
                    </a>
                    <a href="https://github.com/eysure/aquarius" target="_blank" rel="noopener noreferrer">
                        <i className="sm-icons">)</i>
                    </a>
                </div>
            </div>
        </div>
    ];
}

mapStateToProps = state => {
    return {
        user: state.user
    };
};

mapDispatchToProps = dispatch => bindActionCreators({ appClose }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Welcome);
