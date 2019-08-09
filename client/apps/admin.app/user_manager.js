import React, { Component } from "react";
import { connect } from "react-redux";
import * as AQUI from "../../components/Window/core";

import { R } from "./";

import AddUser from "./add_user";

export class UserManager extends Component {
    state = {
        openNewUserWindow: false
    };

    render() {
        return (
            <div className="window-content-inner">
                <div className="panel-title">{R.Str("ADD_USER")}</div>
                <div className="panel">
                    <AQUI.PanelItem title={R.Str("ADD_USER")} onClick={() => this.setState({ openNewUserWindow: true })} />
                </div>
                {this.renderNewUserWindow()}
            </div>
        );
    }

    renderNewUserWindow = () => {
        return this.state.openNewUserWindow && <AddUser context={this.props.context} onClose={() => this.setState({ openNewUserWindow: false })} />;
    };
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserManager);
