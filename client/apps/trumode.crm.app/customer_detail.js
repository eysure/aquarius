import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as AQUI from "../../components/Window/core";
import { R } from "./index";

import Window from "../../components/Window";

class CustomerDetail extends Component {
    render() {
        return (
            <Window
                onClose={this.props.onClose}
                key={`Customer Detail: ${this.props.customer._id._str}`}
                _key={`Customer Detail: ${this.props.customer._id._str}`}
                width={480}
                appKey={this.props.context.props.appKey}
                theme="dark"
                escToClose
            >
                <div className="window-content-inner handle">
                    <h1>{this.props.customer.name}</h1>
                </div>
            </Window>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
    return {
        db: state.db
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerDetail);
