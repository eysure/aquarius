import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { R } from "../../resources_feeder";

import { throwMsg, appClose } from "../../actions";

export class Application extends Component {
    state = { hasError: false };

    render() {
        if (this.state.hasError) return null;

        return this.props.children;
    }

    componentDidCatch(error, info) {
        let msgContent = error + "\n" + JSON.stringify(info);
        this.props.throwMsg(R.Msg("APP_CRASH", { msgContent }));
        this.props.appClose(this.props.appKey);
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
}

const mapStateToProps = state => ({
    windows: state.windows
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg, appClose }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Application);
