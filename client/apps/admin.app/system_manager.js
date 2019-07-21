import React, { Component } from "react";
import { connect } from "react-redux";

export class SystemManager extends Component {
    render() {
        return <div>System Manager</div>;
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SystemManager);
