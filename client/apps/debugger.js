import React, { Component } from "react";
import { connect } from "react-redux";

import { getAppName } from "../app_utils";

import Window, { WINDOW_PRIORITY_HIGH } from "../components/Window";
import ReactJson from "react-json-view";

class Debugger extends Component {
    toolbar = () => {
        return null;
    };

    render() {
        return (
            <Window
                key="Main"
                _key="Main"
                appKey={this.props.appKey}
                height={600}
                x={"70vw"}
                y={"0px"}
                titlebar={getAppName("debugger", this.props.allStates.user)}
                theme="dark"
                windowPriority={WINDOW_PRIORITY_HIGH}
                contentStyle={{ background: "rgba(39, 40, 34, 0.8)" }}
                toolbar={this.toolbar()}
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
