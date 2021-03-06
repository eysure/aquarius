import React, { Component } from "react";
import MenuBarMenu from "./menu_bar_menu";

export default class MenuBar extends Component {
    render() {
        return (
            <div
                className="menu-bar"
                style={{
                    transform: this.props.hide ? "translate(0,-24px)" : "translate(0,0)",
                    ...this.props.style
                }}
                onContextMenu={e => e.preventDefault()}
            >
                <MenuBarMenu name="mainMenuBarMenu" content={this.props.menuBarMenu} />
                <MenuBarMenu name="mainMenuBarExtra" content={this.props.menuBarExtra} />
            </div>
        );
    }
}
