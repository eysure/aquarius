import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { throwMsg, appClose } from "../actions";
import { R } from "../resources_feeder";

class AppShell extends React.Component {
    render() {
        return this.props.children;
    }

    componentDidCatch(error, info) {
        let msgContent = error + "\n" + JSON.stringify(info);
        this.props.throwMsg(R.Msg("APP_CRASH", { msgContent }));
        this.props.appClose(this.props.children.key);
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg, appClose }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.user,
        apps: state.apps
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppShell);
