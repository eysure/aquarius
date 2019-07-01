import React, { Component } from "react";

export default class MenuItem extends Component {
    itemRef = React.createRef();

    render() {
        let className = ["menu-item"];
        if (this.props.isTitle) className.push("title");
        if (this.props.disabled) className.push("disabled");
        if (this.props.isSubmenuParent) className.push("active");
        if (this.props.submenu && this.props.submenu.length === 0 && this.props.disableEmptyMenu) {
            className.push("disabled");
        }

        return (
            <li
                ref={this.itemRef}
                className={className.join(" ")}
                onMouseEnter={this.onMouseEnter}
                onMouseUp={this.onClick}
                style={this.props.style}
                onBlur={this.handleBlur}
            >
                <div className="menu-item-main">
                    <span className="menu-item-prefix">{this.props.prefix ? <i>{this.props.prefix}</i> : ""}</span>
                    <span className="menu-item-text">{this.props.title}</span>
                </div>
                <div className="menu-item-extra">{this.props.submenu != null ? <i>▶</i> : this.props.extra}</div>
            </li>
        );
    }

    onMouseEnter = e => {
        if (this.props.submenu && this.props.submenu.length === 0 && this.props.disableEmptyMenu) {
            return;
        } else if (this.props.submenu) {
            let rect = e.currentTarget.getBoundingClientRect();
            this.props.setSubmenu({
                x: rect.x + rect.width,
                y: rect.y - 5,
                content: this.props.submenu,
                parent: this.props._key
            });
        } else {
            this.props.setSubmenu(null);
        }
    };

    onClick = e => {
        // If the menu item is title or disabled, cannot click
        if (this.props.disabled || this.props.isTitle || this.props.submenu) return;

        // Call the onClick method
        if (this.props.onClick != null) this.props.onClick();

        // Call the context state to close
        if (this.props.disableAnimation) {
            this.props.context.setState({ [this.props.name]: false });
        } else {
            let item = this.itemRef.current;
            let menus = document.getElementsByName(this.props.name);
            item.classList.add("menu-item-click");
            menus.forEach(menu => {
                menu.classList.add("menu-fade-out");
                let eventListener = () => {
                    menu.classList.remove("menu-fade-out");
                    menu.removeEventListener("animationend", eventListener);
                    this.props.context.setState({ [this.props.name]: false });
                };
                menu.addEventListener("animationend", eventListener);
            });
        }
    };
}
