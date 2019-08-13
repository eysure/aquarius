import React, { Component } from "react";
import Window from "./Window";

export default class DoubleCheck extends Component {
    render() {
        return (
            this.props.context.state[this.props.name] === 1 && (
                <Window
                    onClose={e => this.props.context.setState({ [this.props.name]: 0 })}
                    _key={this.props._key}
                    width={600}
                    appKey={this.props.appKey}
                    title={this.props.title}
                    noTitlebar
                    theme="light"
                    escToClose
                    canResize={false}
                    canMaximize={false}
                    canMinimize={false}
                    noControl={true}
                    backDrop={true}
                >
                    <div className="vcc v-full h-full">
                        <div className="hsc" style={{ margin: 24, fontWeight: 400 }}>
                            <div style={{ marginRight: 16 }}>
                                <i className="material-icons">warning</i>
                            </div>
                            {this.props.children || this.props.content || "Are you sure?"}
                        </div>
                        <hr style={{ margin: 0 }} />
                        <div className="hec h-full">
                            <button className="aqui-btn" onClick={e => this.props.context.setState({ [this.props.name]: 0 })}>
                                No
                            </button>
                            <button className="aqui-btn" onClick={e => this.props.context.setState({ [this.props.name]: 2 })}>
                                Delete
                            </button>
                        </div>
                    </div>
                </Window>
            )
        );
    }
}
