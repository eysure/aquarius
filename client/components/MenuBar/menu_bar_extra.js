import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ACT from "../../actions";

class MenuBarExtra extends Component {
    state = {
        fullscreen: false,
        currentTime: new Date()
    };

    render() {
        return (
            <ul className="menu-bar-extras">
                <li className="menu-bar-item" onClick={this.toggleFullscreen}>
                    <i>{this.state.fullscreen ? "fullscreen_exit" : "fullscreen"}</i>
                </li>
                <li className="menu-bar-item">{this.state.currentTime.toLocaleString()}</li>
                <li className="menu-bar-item" onClick={() => this.props.appLaunch("search")}>
                    <i>search</i>
                </li>
                <li className="menu-bar-item">
                    <i>list</i>
                </li>
            </ul>
        );
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ currentTime: new Date() });
        }, 1000);
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ACT, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.user,
        apps: state.apps,
        system: state.system
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBarExtra);
