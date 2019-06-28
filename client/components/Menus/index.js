import React, { Component } from "react";

import MenuItem from "./menu_item";
import MenuDivider from "./menu_divider";

export default class Menu extends Component {
    defaultState = {
        submenuOpen: false,
        submenuX: 0,
        submenuY: 0,
        submenuContent: [],
        submenuParent: null
    };
    state = this.defaultState;

    menuRef = React.createRef();

    setSubmenu = submenu => {
        if (!submenu) {
            this.setState({
                submenuOpen: false,
                submenuX: 0,
                submenuY: 0,
                submenuContent: [],
                submenuParent: null
            });
        } else {
            this.setState({
                submenuOpen: true,
                submenuX: submenu.x,
                submenuY: submenu.y,
                submenuContent: submenu.content,
                submenuParent: submenu.parent
            });
        }
    };

    renderList(menuList) {
        // When menuList is null or empty
        if (!menuList || !Array.isArray(menuList) || menuList.length === 0) {
            return this.renderEmptyMenu();
        }

        let dividerCount = 0;

        return menuList.map(item => {
            if (item.divider) return <MenuDivider key={`divider${dividerCount++}`} />;
            else {
                let key = item.key || item.title;
                if (key == null) {
                    console.error("Menu item key is not set. It will not show in the menu unless the key is set", item);
                } else
                    return (
                        <MenuItem
                            key={key}
                            _key={key}
                            setSubmenu={this.setSubmenu}
                            isSubmenuParent={key === this.state.submenuParent}
                            {...item}
                            context={this.props.context}
                            name={this.props.name}
                            style={this.props.menuItemStyle}
                            disableEmptyMenu={this.props.disableEmptyMenu}
                            disableAnimation={this.props.disableAnimation}
                        />
                    );
            }
        });
    }

    render() {
        if (!this.props.context || !this.props.name) {
            console.log("context or name is not set");
            return null;
        }
        // (Root Menu) When Root Menu is close (context state of menu name is false) close
        if (!this.props.context.state[this.props.name]) {
            return null;
        }
        // (Sub Menu) When this menu is submenu, but submenuOpen is false, close
        if (this.props.isSubmenu && !this.props.parentOpen) {
            return null;
        }

        let classList = ["menu"];
        if (this.props.dropDown) classList.push("drop-down");

        return (
            <>
                {!this.props.isSubmenu ? this.renderBackDrop() : ""}
                <ul
                    ref={this.menuRef}
                    id={this.props.isSubmenu ? null : this.props.name}
                    name={this.props.name}
                    className={classList.join(" ")}
                    style={{ transform: `translate(${this.props.x || 0}px, ${this.props.y || 0}px)`, ...this.props.style }}
                    onContextMenu={e => e.preventDefault()}
                >
                    {this.renderList(this.props.content || this.props.children)}
                </ul>
                <Menu
                    isSubmenu
                    parentOpen={this.state.submenuOpen}
                    x={this.state.submenuX}
                    y={this.state.submenuY}
                    content={this.state.submenuContent}
                    context={this.props.context}
                    name={this.props.name}
                    style={this.props.style}
                    menuItemStyle={this.props.menuItemStyle}
                    disableEmptyMenu={this.props.disableEmptyMenu}
                    emptyMenuText={this.props.emptyMenuText}
                />
            </>
        );
    }

    renderBackDrop = () => {
        if (this.props.disableBackDrop) return null;
        return (
            <div
                className="menu-back-drop"
                onClick={() => this.menuExit(true)}
                onMouseDown={() => this.menuExit(true)}
                onContextMenu={e => {
                    e.preventDefault();
                }}
            />
        );
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
                    this.setSubmenu();
                    this.props.context.setState({ [this.props.name]: false });
                };
                menu.classList.add(direct ? "menu-fade-out-direct" : "menu-fade-out");
                menu.addEventListener("animationend", eventListener);
            });
        }
    };

    renderEmptyMenu = () => {
        return (
            <MenuItem
                isTitle
                setSubmenu={this.setSubmenu}
                title={this.props.emptyMenuText}
                context={this.props.context}
                name={this.props.name}
                style={this.props.menuItemStyle}
                disableEmptyMenu={this.props.disableEmptyMenu}
                disableAnimation={this.props.disableAnimation}
            />
        );
    };

    componentDidUpdate(prevProps, prevState) {
        if (!this.props.context.state[this.props.name] && this.state.submenuOpen) {
            this.setState(this.defaultState);
        }
        if (this.props.content !== prevProps.content || this.props.x !== prevProps.x || this.props.y !== prevProps.y) {
            this.setState(this.defaultState);
        }
    }
}

Menu.defaultProps = {
    // The parent who create the menu, use to let the menu close by itself
    context: null,

    // The state name of this menu in the context (parent), with context together to close the menu itself
    name: null,

    // The JSON list of the menu, see doc for details (either use content or children)
    content: null,

    // The JSON list of the menu, see doc for details (either use content or children)
    children: null,

    // X coordination of the menu on the screen
    x: 0,

    // Y coordination of the menu on the screen
    y: 0,

    // Disable the backdrop component, cannot close the menu by click-out the menu
    disableBackDrop: false,

    // Disalbe the animation
    disableAnimation: false,

    // Rewrite the menu style
    style: null,

    // Rewrite the menuItem style
    menuItemStyle: null,

    // If a submenu is empty, this parent menu item will be grey out, user cannot select it, nor see the emty menu text
    disableEmptyMenu: false,

    // Show the empty menu text
    emptyMenuText: "<Empty Menu>",

    // Use for menubar menu, slightly change the syle, without border-top and radius
    dropDown: false
};
