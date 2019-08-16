import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { bindActionCreators } from "redux";
import Window from "../../components/Window";
import { ResourceFeeder } from "../../resources_feeder";
import SystemManager from "./system_manager";
import UserManager from "./user_manager";

import * as AQUI from "../../components/Window/core";

import pinyin from "pinyin";

export const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));

export const TAB_USER_MANAGER = "TAB_USER_MANAGER";
export const TAB_SYSTEM_MANAGER = "TAB_SYSTEM_MANAGER";

class Admin extends React.Component {
    state = {
        selected: null,
        open: true,

        disabled: false,
        multivalue: false,
        light: true,
        selectedOption: "strawberry"
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
                return <SystemManager context={this} />;
            default:
                return this.renderDefaultPage();
        }
    };

    onInputChange = val => {
        this.setState({ openMenu: true });
        console.log(val);
    };

    options = {
        "0": "中文测试",
        "1": "效果拔群",
        "2": "天旋地转",
        "3": "人仰马翻",
        "4": "Also Contains English inside :)"
    };

    schema() {
        return {
            pytest: {
                title: "Pinyin Test",
                type: "select",
                options: {
                    "0": "中文测试",
                    "1": "效果拔群",
                    "2": "天旋地转",
                    "3": "人仰马翻",
                    "4": "Also Contains English inside :)"
                },
                onInputChange: val => this.onInputChange(val),
                // menuIsOpen: this.state.menuIsOpen
                filterOption: (option, input) => {
                    const label = pinyin(option.label, { style: pinyin.STYLE_NORMAL }).join("");
                    return label.match(input);
                }
            }
        };
    }

    renderDefaultPage = () => {
        const options = [{ value: "chocolate", label: "Chocolate" }, { value: "strawberry", label: "Strawberry" }, { value: "vanilla", label: "Vanilla" }];

        return (
            <div style={{ padding: 4 }}>
                <Select
                    classNamePrefix="aqui-rs"
                    value={this.state.selectedOption}
                    onChange={val => this.setState({ selectedOption: val })}
                    options={options}
                    isMulti={false}
                />
                ; disabled
                <input type="checkbox" value={this.state.disabled} onChange={e => this.setState({ disabled: !this.state.disabled })} />
                multiValue
                <input type="checkbox" value={this.state.multivalue} onChange={e => this.setState({ multivalue: !this.state.disabled })} />
                <hr />
                theme
                <input type="checkbox" value={this.state.light} onChange={e => this.setState({ light: !this.state.light })} />
                {this.state.selectedOption.toString()}
                <input value={this.state.pyinput} onChange={e => this.setState({ pyinput: e.target.value })} />
                {pinyin(this.state.pyinput)}
                <AQUI.FieldItem context={this} schema={this.schema()} name="pytest" />
            </div>
        );
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
                title={R.Trans(Admin.manifest.appName)}
                noTitlebar
                theme={this.state.light ? "light" : "dark"}
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
    appName: ["Admin", "管理员"],
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
