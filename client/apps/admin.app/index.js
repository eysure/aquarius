import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Action from "../../actions";
import Window from "../../components/Window";

import UserManager from "./user_manager";
import SystemManager from "./system_manager";

import { ResourceFeeder } from "../../resources_feeder";
export const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));

export const TAB_USER_MANAGER = "TAB_USER_MANAGER";
export const TAB_SYSTEM_MANAGER = "TAB_SYSTEM_MANAGER";

class Admin extends React.Component {
    state = {
        selected: null,
        open: true
    };

    renderSidebar = () => {
        let tabs = new Set();
        let sidebar = [];

        if (!this.props.auth) return sidebar;
        if (this.props.auth.user_admin) tabs.add(TAB_USER_MANAGER);
        if (this.props.auth.system_admin) tabs.add(TAB_USER_MANAGER);

        for (let tab of tabs) {
            sidebar.push(
                <li key={tab} className={this.state.selected == tab ? "active" : ""} onClick={() => this.setState({ selected: tab })}>
                    {R.Str(tab)}
                </li>
            );
        }
        return sidebar;
    };

    renderContent = () => {
        switch (this.state.selected) {
            case TAB_USER_MANAGER:
                return <UserManager context={this} />;
            case TAB_SYSTEM_MANAGER:
                return <SystemManager />;
            default:
                return <div className="empty-page">Admin</div>;
        }
    };

    handleClose = e => {};

    render() {
        if (!this.state.open) return null;
        return (
            <Window key={"admin"} _key={"admin"} width={800} height={600} appKey={this.props.appKey} theme="dark" onClose={e => this.setState({ open: false })}>
                <div className="window-sidebar-container">
                    <div className="window-sidebar">
                        <ul>{this.renderSidebar()}</ul>
                    </div>
                    <div className="window-sidebar-content">{this.renderContent()}</div>
                </div>
            </Window>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    auth: state.auth
});

const mapDispatchToProps = dispatch => bindActionCreators(Action, dispatch);

Admin.manifest = {
    appKey: "admin",
    appName: ["Admin", "管理员"],
    icon: "/assets/apps/chauffeur.svg"
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Admin);
