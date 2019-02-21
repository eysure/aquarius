import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Str from "../components/string_component";

import Window from "../components/dialog";
import ReactJson from "react-json-view";
import Terminal from "terminal-in-react";

class Debugger extends Component {
    static appStaticProps = {
        appName: ["Debugger", "调试器"],
        materialIcon: true,
        icon: "bug_report",
        defaultOption: {
            alwaysOnFront: true
        }
    };

    render() {
        return (
            <React.Fragment>
                <Window
                    appProps={this.props.appProps}
                    width={720}
                    height={480}
                    style={{ backgroundColor: "RGB(39,40,34)" }}
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
                <Window
                    appProps={this.props.appProps}
                    width={720}
                    height={654}
                    style={{ backgroundColor: "RGB(34,34,34)" }}
                >
                    <Terminal
                        startState="maximised"
                        allowTabs={false}
                        hideTopBar={true}
                        watchConsoleLogging
                    />
                </Window>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        allStates: state
    };
}

export default connect(
    mapStateToProps,
    null
)(Debugger);
