import React, { Component } from "react";
import { animate } from "../../utils";

export default class LaunchpadItem extends Component {
    onClick = e => {
        if (e.button == 1) return;
        animate(e.currentTarget, null, "launchpad-open");
        this.props.onClick();
        this.props.close();
    };

    render() {
        return (
            <div
                className="launchpad-item"
                draggable
                onMouseEnter={() => this.props.itemHovering(true)}
                onMouseLeave={() => this.props.itemHovering(false)}
                onClick={this.onClick}
            >
                <div className="launchpad-item-icon" alt={this.props.title} draggable={false}>
                    <img className="launchpad-item-icon" src={this.props.icon || "/assets/apps/box.svg"} />
                </div>
                <div className="launchpad-item-title">{this.props.title || "Unnamed Item"}</div>
                {this.props.subtitle ? <div className="launchpad-item-subtitle">{this.props.subtitle}</div> : null}
                {this.props.badge ? <div className="launchpad-item-badge">{this.props.badge}</div> : null}
            </div>
        );
    }
}
