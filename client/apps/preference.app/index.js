import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";

import Window from "../../components/dialog";
import AppTabDrawer from "../../components/app_tab_drawer";

import { throwMsg } from "../../actions";

import { ResourceFeeder } from "../../resources_feeder";
const R = new ResourceFeeder(require("./resources/strings"), null);

class Preference extends Component {
    static appStaticProps = {
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

    componentDidMount = () => {
        this.props.throwMsg(R.Msg("APP_NOT_READY"));
    };

    render() {
        return (
            <Window appProps={this.props.appProps} width={840} height={720} layout="horizontal" titleBarStyle="fusion">
                <AppTabDrawer appStaticProps={this.constructor.appStaticProps} />
                <div className="content">123</div>
            </Window>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => bindActionCreators({ throwMsg }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Preference);
