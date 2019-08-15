import PropTypes from "prop-types";
import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { appClose, throwMsg } from "../../actions";
import { R } from "../../resources_feeder";

export class Application extends Component {
    state = { hasError: false };

    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }

    componentDidUpdate() {
        let { windows, app } = this.props;

        // If not documentBased, close the app if no windows remains
        if (!app.manifest.documentBase) {
            if (!windows || Object.keys(windows).length === 0) {
                this.props.appClose(app.appKey);
            }
        }

        // Deal with application options
        // ...

        // Check if this user has the auth to run this app
        if (this.props.auth.apps && !this.props.auth.apps.includes(app.appKey)) {
            this.props.throwMsg(R.Msg("APPLICATION_PERMISSION_DENIED"));
            this.props.appClose(app.appKey);
        }
    }

    // When this app crash, generate the error message and send
    componentDidCatch(error, info) {
        let msgContent = error + "\n" + JSON.stringify(info);
        this.props.throwMsg(R.Msg("APP_CRASH", { msgContent }));
        this.props.appClose(this.props.app.appKey);
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ throwMsg, appClose }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Application);

Application.propTypes = {
    app: PropTypes.object.isRequired,
    windows: PropTypes.object,
    children: PropTypes.node.isRequired,

    auth: PropTypes.object,
    throwMsg: PropTypes.func,
    appClose: PropTypes.func
};
