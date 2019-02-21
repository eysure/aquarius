import React, { Component } from "react";
import * as UI from "@material-ui/core";

import Window from "../../components/dialog";
import AppTabDrawer from "../../components/app_tab_drawer";

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

    render() {
        return (
            <Window appProps={this.props.appProps} width={840} height={720} layout="horizontal" titleBarStyle="fusion">
                <AppTabDrawer appStaticProps={this.constructor.appStaticProps} />
                <div className="content">123</div>
            </Window>
        );
    }
}

export default Preference;
