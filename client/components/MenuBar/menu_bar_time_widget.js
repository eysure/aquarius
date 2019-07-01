import React, { Component } from "react";

export default class MenuBarTimeWidget extends Component {
    state = {
        time: new Date()
    };

    render() {
        return this.state.time.toLocaleString();
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ time: new Date() });
        }, 1000);
    }
}
