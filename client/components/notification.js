import React from "react";
import clientConfig from "../client_config";
import * as AQUI from "./Window/core";
import * as UI from "@material-ui/core";
import ReactJson from "react-json-view";
import { R } from "../resources_feeder";

const notificationStyle = {
    position: "relative",
    top: 0,
    marginBottom: "20px",
    width: "360px",
    backgroundColor: "#dadada",
    borderRadius: "6px",
    float: "right",
    clear: "both",
    boxShadow: "0 5px 40px 5px rgba(0,0,0,0.2)",
    overflow: "auto",
    maxWidth: "800px",
    maxHeight: "480px",
    pointerEvents: "all",
    display: "flex",
    flexFlow: "column",
    padding: "12px 16px",
    border: "1px solid rgba(35,35,35,0.15)"
};

const titleStyle = {
    fontFamily: "San Francisco",
    fontWeight: 400,
    fontSize: "1.125rem"
};

const contentStyle = {
    fontFamily: "San Francisco",
    fontSize: "1rem",
    fontWeight: 300,
    whiteSpace: "pre-wrap",
    marginTop: "8px"
};

const msgClsIconMap = {
    0: "info",
    1: "info",
    2: "check_circle",
    3: "error_outline",
    4: "warning",
    5: "error"
};

class Notif extends React.Component {
    handleClose = () => {
        this.props.closeMsg(this.props._key);
    };

    handleMore = () => {
        window.location = this.props.more_info_uri;
    };

    autoHideTimeout = null;

    render() {
        return (
            <div id={this.props._key} style={notificationStyle}>
                <div className="msg-header">
                    <div className="flex-start">
                        {this.renderProgressBar()}
                        {this.props.icon || this.props.class ? (
                            <UI.Icon className="msg-header-icon">{this.props.icon || msgClsIconMap[this.props.class]}</UI.Icon>
                        ) : null}
                        <h3 style={titleStyle}>{this.props.title}</h3>
                    </div>
                    <div className="flex-end">
                        {this.props.more_info_uri ? (
                            <UI.Button key="more" color="secondary" size="small" onClick={this.handleMore}>
                                {this.props.more_info_button || "More"}
                            </UI.Button>
                        ) : null}
                        {this.props.hideClose ? null : (
                            <UI.IconButton key="close" aria-label="Close" color="inherit" style={{ padding: "4px" }} onClick={this.handleClose}>
                                <i className="material-icons">close</i>
                            </UI.IconButton>
                        )}
                    </div>
                </div>
                {this.props.content && <div style={contentStyle}>{this.props.content}</div>}
                {this.renderJsonView()}
            </div>
        );
    }

    renderJsonView() {
        if (!this.props.raw) return null;

        return (
            <ReactJson
                style={{
                    fontSize: "12px",
                    lineHeight: "16px",
                    fontFamily: "monaco",
                    marginTop: 8,
                    marginBottom: 4,
                    padding: 8,
                    borderRadius: 4
                }}
                src={this.props.raw}
                theme="monokai"
                name={R.get("RAW_DATA")}
                collapsed={true}
                displayObjectSize={false}
                displayDataTypes={false}
                enableClipboard={false}
            />
        );
    }

    renderProgressBar = () => {
        if (!this.props.progressBar) return null;

        if (!this.props.progress) {
            return <AQUI.Spinner style={{ transform: "scale(0.5)" }} />;
        } else
            return (
                <UI.CircularProgress
                    style={{
                        marginRight: 8,
                        color: "black"
                    }}
                    size={24}
                    thickness={6}
                    value={this.props.progress}
                />
            );
    };

    componentDidUpdate() {
        this.setAutoHide();
    }

    componentDidMount() {
        this.setAutoHide();
    }

    setAutoHide() {
        if (!this.props.progressBar && !this.props.persist) {
            let delay = this.props.delay || clientConfig.messageCloseDelay;
            this.autoHideTimeout = setTimeout(() => {
                this.handleClose();
            }, delay);
        }
    }

    componentWillUnmount = () => {
        window.clearTimeout(this.autoHideTimeout);
    };
}

export default Notif;
