import React, { Component } from "react";

import Menu from "../Menus";

export default class MenuBarMenu extends Component {
    defaultState = {
        [this.props.name]: false,
        submenuOpen: false,
        submenuX: 0,
        submenuY: 0,
        submenuContent: null,
        submenuParent: null
    };
    state = this.defaultState;

    renderMenuBarMenus(menuList) {
        if (!menuList || !Array.isArray(menuList) || menuList.length === 0) {
            return null;
        }

        return menuList.map(item => {
            let key = item.key || item.title;
            if (key == null) {
                console.error("Menu item key is not set. It will not show in the menu unless the key is set", item);
            } else {
                let classList = ["menu-bar-item"];
                if (this.state[this.props.name] && key === this.state.submenuParent) classList.push("active");
                return (
                    <li
                        key={key}
                        _key={key}
                        className={classList.join(" ")}
                        onMouseEnter={e => this.switchMenuBarMenuItem(e, item, key)}
                        onMouseDown={e => this.activateMenuBarMenuItem(e, item, key)}
                    >
                        {item.title}
                    </li>
                );
            }
        });
    }

    switchMenuBarMenuItem = (e, item, key) => {
        if (this.state[this.props.name] && key !== this.state.submenuParent) {
            this.activateMenuBarMenuItem(e, item, key);
        }
    };

    activateMenuBarMenuItem = (e, item, key) => {
        let button = e.currentTarget;
        if (item.submenu) {
            if (this.state[this.props.name] && key === this.state.submenuParent) {
                this.menuExit();
            } else
                this.setState({
                    [this.props.name]: true,
                    submenuOpen: true,
                    submenuX: button.offsetLeft,
                    submenuY: button.offsetTop + button.offsetHeight,
                    submenuContent: item.submenu,
                    submenuParent: key
                });
        } else if (item.onClick) {
            item.onClick();
        }
    };

    renderBackDrop = () => {
        if (this.state[this.props.name])
            return (
                <div
                    className="menu-back-drop"
                    onClick={this.menuExit}
                    onMouseDown={this.menuExit}
                    onContextMenu={e => {
                        e.preventDefault();
                    }}
                    style={{ top: this.state.submenuY }}
                />
            );
        else return null;
    };

    menuExit = direct => {
        if (this.props.disableAnimation) {
            this.props.context.setState({ [this.props.name]: false });
        } else {
            let menus = document.getElementsByName(this.props.name);
            menus.forEach(menu => {
                let eventListener = () => {
                    menu.classList.remove(direct ? "menu-fade-out-direct" : "menu-fade-out");
                    menu.removeEventListener("animationend", eventListener);
                    this.setState(this.defaultState);
                };
                menu.classList.add(direct ? "menu-fade-out-direct" : "menu-fade-out");
                menu.addEventListener("animationend", eventListener);
            });
        }
    };

    render() {
        return (
            <>
                {this.renderBackDrop()}
                <ul className="menu-bar-menu" style={this.props.style} onContextMenu={e => e.preventDefault()}>
                    {this.renderMenuBarMenus(this.props.content || this.props.children)}
                </ul>

                <Menu
                    isSubmenu
                    parentOpen={this.state.submenuOpen}
                    x={this.state.submenuX}
                    y={this.state.submenuY}
                    content={this.state.submenuContent}
                    context={this}
                    name={this.props.name}
                    style={this.props.style}
                    menuItemStyle={this.props.menuItemStyle}
                    disableEmptyMenu={this.props.disableEmptyMenu}
                    emptyMenuText={this.props.emptyMenuText}
                    dropDown
                    exit={this.menuExit}
                />
            </>
        );
    }
}
