import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Window from "../../components/Window";
import { ResourceFeeder } from "../../resources_feeder";
import SystemManager from "./system_manager";
import UserManager from "./user_manager";

export const R = new ResourceFeeder(require("./resources/strings").default, require("./resources/messages").default);

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
        if (this.props.auth.system_admin) tabs.add(TAB_SYSTEM_MANAGER);

        for (let tab of tabs) {
            sidebar.push(
                <li key={tab} className={this.state.selected == tab ? "active" : ""} onClick={() => this.setState({ selected: tab })}>
                    {R.get(tab)}
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
                return <SystemManager context={this} />;
            default:
                return this.renderDefaultPage();
        }
    };

    renderDefaultPage = () => {
        return <div className="empty-page">{R.get("APP_NAME")}</div>;
    };

    handleClose = () => {};

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                key={"admin"}
                _key={"admin"}
                width={800}
                height={600}
                appKey={this.props.appKey}
                title={R.trans(Admin.manifest.appName)}
                noTitlebar
                theme={"dark"}
                onClose={() => this.setState({ open: false })}
            >
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

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

Admin.manifest = {
    appKey: "admin",
    appName: R.get("APP_NAME"),
    icon: "/assets/apps/chauffeur.svg"
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Admin);

Admin.propTypes = {
    appKey: PropTypes.string.isRequired,
    user: PropTypes.object,
    auth: PropTypes.object
};
