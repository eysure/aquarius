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

    componentDidUpdate(prevProps, prevState) {
        let { appKey, app, windows } = this.props;

        let option = app.option;
        let manifest = app.manifest;

        // If not documentBased, close the app if no windows remains
        if (!manifest.documentBase) {
            if (!windows || Object.keys(windows).length === 0) {
                this.props.appClose(appKey);
            }
        }

        // Deal with application options
        // ...

        // Check if this user has the auth to run this app
        if (this.props.auth.apps && !this.props.auth.apps.includes(appKey)) {
            this.props.throwMsg(R.Msg("APPLICATION_PERMISSION_DENIED"));
            this.props.appClose(appKey);
        }
    }

    // When this app crash, generate the error message and send
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
    auth: state.auth
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ throwMsg, appClose }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Application);
