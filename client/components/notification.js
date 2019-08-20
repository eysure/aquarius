import PropTypes from "prop-types";
import React from "react";
import ReactJson from "react-json-view";
import { R } from "../resources_feeder";
import * as AQUI from "./Window/core";

const msgClsIconMap = {
    0: "info",
    1: "info",
    2: "check_circle",
    3: "warning",
    4: "error_outline",
    5: "error"
};

class Notification extends React.Component {
    static propTypes = {
        _key: PropTypes.string.isRequired,
        title: PropTypes.string,
        icon: PropTypes.node,
        class: PropTypes.number,
        hideClose: PropTypes.bool,
        more_info_button: PropTypes.string,
        more_info_uri: PropTypes.string,

        content: PropTypes.node,
        raw: PropTypes.object,

        delay: PropTypes.number,
        pending: PropTypes.bool,
        progress: PropTypes.number,
        persist: PropTypes.bool,
        onClick: PropTypes.func,

        closeMsg: PropTypes.func
    };

    handleClose = () => {
        this.props.closeMsg(this.props._key);
    };

    handleMore = () => {
        window.location = this.props.more_info_uri;
    };

    autoHideTimeout = null;

    render() {
        return (
            <div id={this.props._key} className="aqui-glass aqui-notif" onClick={this.props.onClick || this.handleClose}>
                <div className="aqui-notif-header">
                    <div className="hsc">
                        <div className="aqui-notif-icon">{this.renderIcon()}</div>
                        <h3>{this.props.title || R.get("NOTIFICATION_DEFAULT_TITLE")}</h3>
                    </div>
                    <div className="hec aqui-notif-operations">
                        {this.props.more_info_uri && (
                            <button className="aqui-btn" onClick={this.handleMore}>
                                {this.props.more_info_button || "More"}
                            </button>
                        )}
                        {this.props.hideClose ? null : (
                            <button className="aqui-btn circle" onClick={this.handleClose}>
                                <i className="material-icons">close</i>
                            </button>
                        )}
                    </div>
                </div>
                {this.props.content && <div className="aqui-notif-body">{this.props.content}</div>}
                {this.renderJsonView()}
            </div>
        );
    }

    renderIcon() {
        if (this.props.pending) {
            return <AQUI.Spinner style={{ fontSize: 24 }} />;
        }
        if (this.props.icon) {
            return this.props.icon;
        }
        if (this.props.class) {
            return <i className="material-icons">{msgClsIconMap[this.props.class]}</i>;
        }
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

    componentDidUpdate() {
        this.setAutoHide();
    }

    componentDidMount() {
        this.setAutoHide();
    }

    setAutoHide() {
        if (!this.props.pending && !this.props.progress && !this.props.persist) {
            let delay = this.props.delay || 3000;
            this.autoHideTimeout = setTimeout(() => {
                this.handleClose();
            }, delay);
        }
    }

    componentWillUnmount = () => {
        window.clearTimeout(this.autoHideTimeout);
    };
}

export default Notification;
