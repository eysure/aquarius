import { Divider } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { appClose } from "../../actions";
import Window from "../../components/Window";
import { ResourceFeeder } from "../../resources_feeder";

const R = new ResourceFeeder(require("./resources/strings").default, require("./resources/messages").default);

class Welcome extends Component {
    state = { open: true, index: 0 };

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                key="Main"
                _key="Main"
                width={"80vmin"}
                height={"60vmin"}
                appKey={this.props.appKey}
                title={R.trans(Welcome.manifest.appName)}
                noTitlebar
                canResize={false}
                canMaximize={false}
                onClose={() => this.setState({ open: false })}
            >
                {this.pages[this.state.index]}
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
        <div key="welcome-page-1" className="vcc h-full">
            <img style={{ height: "40%", position: "absolute", bottom: 0 }} src="/assets/apps/aquarius.svg" />
            <div style={{ position: "absolute", top: "35%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>Welcome to AquariusOS</h1>
                <h2 style={{ fontWeight: 100, marginTop: 0 }}>Demo version</h2>
            </div>
        </div>,
        <div key="welcome-page-2" className="vcc h-full">
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
        <div key="welcome-page-3" className="vcc h-full">
            <img style={{ width: "20%" }} src="/assets/apps/rocket.svg" />
            <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>Use Launchpad to launch an app</h2>
        </div>,
        <div key="welcome-page-4" className="vcc h-full">
            <img style={{ width: "100%", position: "absolute", bottom: 0 }} src="/assets/guide/window_ctrl.png" />
            <h2 style={{ fontSize: "2rem", marginBottom: "30%" }}>Full window control</h2>
        </div>,
        <div key="welcome-page-5" className="vcc h-full">
            <img style={{ width: "100%", position: "absolute", bottom: 0 }} src="/assets/guide/dnd.png" />
            <h2 style={{ fontSize: "2rem", marginBottom: "30%" }}>Drag and drop to change desktop, avatars and more!</h2>
        </div>,
        <div key="welcome-page-6" className="vcc h-full">
            <div style={{ height: "100%", padding: "32px 64px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <span style={{ fontSize: "8rem" }}>👨🏻‍💻</span>
                <h1 style={{ fontSize: "2rem" }}>And more cool features are comming soon!</h1>
                <button className="aqui-btn" style={{ width: "50%", margin: "32px" }} onClick={() => this.props.appClose(this.props.appKey)}>
                    Enjoy
                </button>
                <p style={{ fontSize: "1rem", fontWeight: 300, width: "80%", position: "absolute", bottom: "32px", color: "grey" }}>
                    Please understand that this system is still working in progress. Bugs and crashes should be expected. Any advice or feekback are welcome,
                    feel free to send me an email. Thanks for all your understanding.
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

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ appClose }, dispatch);

Welcome.manifest = {
    appKey: "welcome",
    appName: R.get("APP_NAME"),
    icon: "/assets/apps/cardiology.svg",
    menubar: [{ title: "test" }]
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Welcome);
