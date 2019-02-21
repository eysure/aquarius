import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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

class LaunchpadItem extends React.Component {
    onMouseDown = e => {
        e.preventDefault();
    };

    onMouseMove = e => {
        e.preventDefault();
        // NOthing
    };

    onDragOver = e => {
        e.preventDefault();
        // Logic here
    };

    render() {
        return (
            <div
                className="launchpad-item"
                draggable
                style={launchpadItemStyle}
                onClick={this.props.onClick}
                onMouseDown={this.props.itemDown}
                onMouseUp={this.props.itemUp}
                onTouchStart={this.props.itemDown}
                onTouchEnd={this.props.onClick}
                onDragStart={this.props.itemDown}
                onDragEnd={this.props.itemUp}
            >
                <div alt={this.props.title} style={iconStyle} draggable={false}>
                    {this.props.icon || (
                        <img style={iconStyle} src="/assets/apps/box.svg" />
                    )}
                </div>
                <div style={titleStyle}>{this.props.title}</div>
                {this.props.badge ? (
                    <div style={badgeStyle}>{this.props.badge}</div>
                ) : null}
            </div>
        );
    }
}

export default connect(
    state => {
        return { system: state.system };
    },
    null
)(LaunchpadItem);
