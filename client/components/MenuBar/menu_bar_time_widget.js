import React from "react";
import moment from "moment";

export default class MenuBarTimeWidget extends React.Component {
    render() {
        return moment().format("llll");
    }

    componentDidMount() {
        setInterval(() => {
            this.forceUpdate();
        }, 10000);
    }
}
