import React, { Component } from "react";
import { connect } from "react-redux";

import { ResourceFeeder } from "../resources_feeder";
const R = new ResourceFeeder(null);

import Window, { WINDOW_PRIORITY_HIGH } from "../components/Window";
import ReactJson from "react-json-view";

class Debugger extends Component {
    state = { open: true };
    toolbar = () => {
        return null;
    };

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                key="Main"
                _key="Main"
                appKey={this.props.appKey}
                height={600}
                x={"70vw"}
                y={"0px"}
                title={R.Trans(Debugger.manifest.appName)}
                theme="dark"
                windowPriority={WINDOW_PRIORITY_HIGH}
                contentStyle={{ background: "rgba(39, 40, 34, 0.8)" }}
                toolbar={this.toolbar()}
                onClose={e => this.setState({ open: false })}
            >
                <ReactJson
                    style={{
                        fontFamily: "menlo",
                        fontSize: "12px",
                        lineHeight: "16px"
                    }}
                    src={this.props.allStates}
                    theme="monokai"
                    name={null}
                    collapsed={2}
                    displayObjectSize={false}
                    displayDataTypes={false}
                    enableClipboard={false}
                    iconStyle={"circle"}
                    style={{ background: "none", fontFamily: "monaco", fontSize: "0.8rem" }}
                />
            </Window>
        );
    }
}

function mapStateToProps(state) {
    return {
        allStates: state
    };
}

Debugger.manifest = {
    appKey: "debugger",
    appName: ["Debugger", "调试器"],
    icon: "/assets/apps/daycare.svg",
    defaultOption: {
        alwaysOnFront: true
    }
};

export default connect(
    mapStateToProps,
    null
)(Debugger);
