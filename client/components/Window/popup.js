import React, { Component } from "react";
import Window from ".";

export default class Popup extends Component {
    onClose = e => {
        if (this.props.onCancel) this.props.onCancel();
        this.props.context.setState({ [this.props.name]: false });
    };

    onCheck = e => {
        if (this.props.onCheck) this.props.onCheck();
        this.onClose();
    };

    render() {
        if (!this.props.context.state[this.props.name]) return null;

        return (
            <Window
                onClose={this.onClose}
                _key={this.props._key || this.props.name}
                width={this.props.width}
                height={this.props.height}
                appKey={this.props.appKey}
                title={this.props.title || this.props.name}
                noTitlebar
                theme="light"
                escToClose={this.props.escToClose}
                canClose={this.props.canClose}
                canResize={false}
                canMaximize={false}
                canMinimize={false}
                noControl={true}
                backDrop={this.props.backDrop}
            >
                <div className="vcc v-full h-full">
                    <div className="hsc" style={{ margin: 24, fontWeight: 400 }}>
                        <div style={{ marginRight: 16 }}>
                            <i className="material-icons">warning</i>
                        </div>
                        {this.props.children || this.props.content || "Are you sure?"}
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

Popup.defaultProps = {
    width: 480,
    height: "auto",
    escToClose: true,
    canClose: true,
    backDrop: true
};
