import React, { Component } from "react";
import { connect } from "react-redux";

import Window from "../components/dialog";
import ReactJson from "react-json-view";

class Debugger extends Component {
    static appStaticProps = {
        appName: ["Debugger", "调试器"],
        icon: "/assets/apps/ant.svg",
        defaultOption: {
            alwaysOnFront: true
        }
    };

    render() {
        return (
            <Window appProps={this.props.appProps} width={720} height={480} style={{ backgroundColor: "RGB(39,40,34)", border: "none" }}>
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

export default connect(
    mapStateToProps,
    null
)(Debugger);
