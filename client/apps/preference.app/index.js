import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { throwMsg } from "../../actions";

import Window from "../../components/Window";

import { ResourceFeeder } from "../../resources_feeder";
import { getAppName } from "../../app_utils";
const R = new ResourceFeeder(require("./resources/strings"), null);

class Preference extends Component {
    state = { open: true };

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                key="Main"
                _key="Main"
                appKey={this.props.appKey}
                width={800}
                height={600}
                title={R.Trans(Preference.manifest.appName)}
                onClose={e => this.setState({ open: false })}
            >
                <div>Preferences</div>
            </Window>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => bindActionCreators({ throwMsg }, dispatch);

Preference.manifest = {
    appKey: "preference",
    appName: ["Preference", "偏好设置"],
    icon: "/assets/apps/gear 2.svg",
    tabs: [
        {
            tabKey: "general",
            tabName: ["General", "通用"],
            materialIcon: true,
            icon: "settings"
        },
        {
            tabKey: "notifications",
            tabName: ["Notifications", "通知"],
            materialIcon: true,
            icon: "sms"
        },
        {
            tabKey: "desktop",
            tabName: ["Desktop", "桌面"],
            materialIcon: true,
            icon: "desktop_windows"
        }
    ]
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Preference);
