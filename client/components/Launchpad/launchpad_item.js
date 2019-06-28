import React, { Component } from "react";

const launchpadItemStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    borderRadius: "0.6vh",
    margin: "1vh"
};

const iconStyle = {
    height: "9vmin",
    width: "9vmin",
    filter: "drop-shadow(0.1vmin 0.1vmin 0.5vmin rgba(0,0,0,0.2))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const titleStyle = {
    fontSize: "1vmin",
    fontFamily: "San Francisco",
    textShadow: "0.1vmin 0.1vmin 0.4vmin black",
    fontWeight: 400,
    marginTop: "0.5vmin",
    minHeight: "1.5vmin"
};

const subtitleStyle = {
    fontSize: "1vmin",
    fontFamily: "San Francisco",
    textShadow: "0.1vmin 0.1vmin 0.4vmin black",
    color: "rgba(255,255,255,0.7)",
    fontWeight: 400,
    minHeight: "1.5vmin"
};

const badgeStyle = {
    position: "absolute",
    transform: "translate(4vmin, -4vmin)",
    background: "rgba(255,0,0,0.8)",
    borderRadius: "1.5vmin",
    filter: "drop-shadow(0 0 0.2vmin rgba(0,0,0,0.5))",
    minWidth: "3vmin",
    minHeight: "3vmin",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2vmin",
    fontWeight: "400"
};

export default class LaunchpadItem extends Component {
    onMouseDown = e => {
        e.preventDefault();
    };

    onMouseMove = e => {
        e.preventDefault();
    };

    onDragOver = e => {
        e.preventDefault();
        // Logic here
    };

    onClick = e => {
        let item = e.currentTarget;
        item.addEventListener("animationend", () => {
            // close launchpad
        });

        e.currentTarget.classList.add("animated", "bounce");

        // Shows animation here
        if (this.props.onClick) this.props.onClick();
    };

    render() {
        return (
            <div
                className="launchpad-item"
                draggable
                style={launchpadItemStyle}
                // onMouseDown={this.props.itemDown}
                // onMouseUp={this.props.itemUp}
                // onTouchStart={this.props.itemDown}
                // onTouchEnd={this.props.onClick}
                // onDragStart={this.props.itemDown}
                // onDragEnd={this.props.itemUp}
            >
                <div className="launchpad-item-icon" alt={this.props.title} style={iconStyle} draggable={false} onClick={this.onClick}>
                    <img style={iconStyle} src={this.props.icon || "/assets/apps/box.svg"} />
                </div>
                <div className="launchpad-item-title" style={titleStyle}>
                    {this.props.title || "Unnamed Item"}
                </div>
                {this.props.subtitle ? (
                    <div className="launchpad-item-subtitle" style={subtitleStyle}>
                        {this.props.subtitle}
                    </div>
                ) : null}

                {this.props.badge ? (
                    <div className="launchpad-item-badge" style={badgeStyle}>
                        {this.props.badge}
                    </div>
                ) : null}
            </div>
        );
    }
}
