import React, { Component } from "react";
import { connect } from "react-redux";

import { getAppName } from "../app_utils";

import Window from "../components/Window";
import ReactJson from "react-json-view";

class Debugger extends Component {
    render() {
        return (
            <Window
                key="Main"
                _key="Main"
                appKey={this.props.appKey}
                width={800}
                height={600}
                titlebar={getAppName("debugger", this.props.allStates.user)}
                theme="dark"
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
    icon: "/assets/apps/ant.svg",
    defaultOption: {
        alwaysOnFront: true
    }
};

export default connect(
    mapStateToProps,
    null
)(Debugger);
