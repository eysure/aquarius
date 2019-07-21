import React, { Component } from "react";
import PI from "../../components/panel_item";
import { connect } from "react-redux";

import { R } from "./";

export class AccountAdvancedTab extends Component {
    renderAuths = () => {
        let auths = this.props.auth;
        let authList = [];

        for (let authKey in auths) {
            authList.push(<PI key={authKey} title={authKey} value={auths[authKey].toString()} />);
        }

        return authList;
    };

    render() {
        return (
            <div className="window-content-inner">
                <div className="panel-title">{R.Str("AUTHORITY_TABLE")}</div>
                <div className="panel">{this.renderAuths()}</div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountAdvancedTab);
