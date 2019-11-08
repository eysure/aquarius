import React, { Component } from "react";
import Window from ".";
import PropTypes from "prop-types";

export default class Popup extends Component {
    static propTypes = {
        onCancel: PropTypes.func,
        onCheck: PropTypes.func,
        context: PropTypes.instanceOf(Component).isRequired,
        title: PropTypes.string,
        name: PropTypes.string.isRequired,
        _key: PropTypes.string,
        appKey: PropTypes.string.isRequired,
        children: PropTypes.node,
        content: PropTypes.node
    };

    static defaultProps = {
        width: 480,
        escToClose: true,
        canClose: true,
        backDrop: true,
        canResize: false,
        canMaximize: false,
        canMinimize: false,
        noControl: true
    };

    onClose = () => {
        if (this.props.onCancel) this.props.onCancel();
        this.props.context.setState({ [this.props.name]: false });
    };

    onCheck = () => {
        if (this.props.onCheck) this.props.onCheck();
        this.onClose();
    };

    render() {
        if (!this.props.context.state[this.props.name]) return null;

        return (
            <Window
                onClose={this.onClose}
                _key={this.props._key || this.props.name}
                appKey={this.props.appKey}
                title={this.props.title || this.props.name}
                noTitlebar
                {...this.props}
            >
                <div className="vcc v-full h-full">
                    <div className="hsc" style={{ margin: 24, fontWeight: 400 }}>
                        <div style={{ marginRight: 16 }}>
                            <i className="material-icons">warning</i>
                        </div>
                        {this.props.children || this.props.content}
                    </div>
                    <hr style={{ margin: 0 }} />
                    <div className="hbc h-full">
                        <div className="hsc h-full">
                            <button className="aqui-btn" onClick={this.onClose}>
                                No
                            </button>
                        </div>

                        <div className="hec h-full">
                            <button className="aqui-btn" onClick={this.onCheck}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </Window>
        );
    }
}
