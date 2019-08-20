import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactJson from "react-json-view";
import { connect } from "react-redux";
import Window, { WINDOW_PRIORITY_HIGH } from "../../components/Window";
import { ResourceFeeder } from "../../resources_feeder";

const R = new ResourceFeeder(require("./resources/strings").default, null);

class Debugger extends Component {
    static propTypes = {
        appKey: PropTypes.string.isRequired,
        allStates: PropTypes.object
    };

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
                title={R.trans(Debugger.manifest.appName)}
                windowPriority={WINDOW_PRIORITY_HIGH}
                contentStyle={{ background: "rgba(39, 40, 34, 0.8)" }}
                toolbar={this.toolbar()}
                onClose={() => this.setState({ open: false })}
            >
                <ReactJson
                    style={{
                        lineHeight: "16px",
                        background: "none",
                        fontFamily: "monaco",
                        fontSize: "0.8rem"
                    }}
                    src={this.props.allStates}
                    theme="monokai"
                    name={null}
                    collapsed={2}
                    displayObjectSize={false}
                    displayDataTypes={false}
                    enableClipboard={false}
                    iconStyle={"circle"}
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
    appName: R.get("APP_NAME"),
    icon: "/assets/apps/daycare.svg",
    defaultOption: {
        alwaysOnFront: true
    }
};

export default connect(
    mapStateToProps,
    null
)(Debugger);
