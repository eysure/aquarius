import React, { Component } from "react";
import PI from "../../components/panel_item";
import { connect } from "react-redux";

import { R } from "./";

export class AccountAdvancedTab extends Component {
    render() {
        return (
            <div className="panel-container-inner">
                <div className="panel-title">{R.Str("AUTHORITY_TABLE")}</div>

                <div className="panel">
                    <PI title={R.Str("CURRENT_PASSWORD")} value="test" />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountAdvancedTab);
