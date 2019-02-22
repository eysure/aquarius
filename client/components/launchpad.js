import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import LaunchpadItem from "./launchpad_item";
import AppLaunchpadItem from "./app_launchpad_item";

import { appLaunch, launchPadControl } from "../actions";
import SwipeableViews from "react-swipeable-views";

const styles = {
    launchpadStyle: {
        fontFamily: "San Francisco",
        fontWeight: 300,
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.36)",
        MozUserSelect: "none",
        WebkitUserSelect: "none",
        MsUserSelect: "none",
        userSelect: "none",
        overflow: "hidden"
    },
    slideContainerStyle: {
        width: "100%",
        height: "100%",
        color: "white",
        margin: "0",
        overflow: "hidden"
    },
    slide: {
        height: "100%",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "San Francisco",
        fontSize: "2rem",
        fontWeight: 100
    },
    navigatorStyle: {
        visibility: "hidden",
        position: "fixed",
        overflow: "hidden",
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bottom: "140px",
        height: "16px"
    },
    searchStyle: {
        visibility: "hidden",
        position: "fixed",
        overflow: "hidden",
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        top: "36px",
        height: "16px"
    }
};

class Launchpad extends React.Component {
    pointerMoved = [null, null];
    state = {
        index: 1,
        isViewPortVertical: false,
        canDrag: true
    };

    pages = 3;

    swipeableViewsRef = React.createRef();

    onTouchStart = e => {
        if (e.button === 1) {
            this.props.launchPadControl(!this.props.system.launchpadStatus);
            return;
        }
        this.pointerMoved = [];
        this.pointerMoved[0] = e.touches ? [e.touches[0].pageX, e.touches[0].pageY] : [e.clientX, e.clientY];
    };
    onTouchMove = e => {
        this.pointerMoved[1] = [e.touches[0].pageX, e.touches[0].pageY];
    };
    onTouchEnd = e => {
        if (!this.pointerMoved[0]) return;
        if (e.button === 1) return;
        if (e.clientX || e.clientY) this.pointerMoved[1] = [e.clientX, e.clientY];
        if (!this.pointerMoved[1]) {
            this.props.launchPadControl(false);
            return;
        }
        let dist = Math.sqrt(Math.pow(this.pointerMoved[0][0] - this.pointerMoved[1][0], 2) + Math.pow(this.pointerMoved[0][1] - this.pointerMoved[1][1], 2));
        if (dist < 6) {
            this.props.launchPadControl(false);
        }
    };

    render() {
        let launchpadStyleAnimation = {
            opacity: this.props.system.launchpadStatus ? 1 : 0,
            transform: this.props.system.launchpadStatus ? "scale(1)" : "scale(1.1)",
            pointerEvents: this.props.system.launchpadStatus ? "unset" : "none",
            transition: "300ms all"
        };

        let launchpadGridStyle = {
            display: "grid",
            gridTemplateColumns: `repeat(${this.state.isViewPortVertical ? 5 : 7}, 16vmin)`,
            gridAutoRows: "16vmin",
            position: "absolute",
            top: "8vh"
        };

        return (
            <div
                id="launchpad"
                style={{ ...styles.launchpadStyle, ...launchpadStyleAnimation }}
                onContextMenu={e => e.preventDefault()}
                onMouseDown={this.onTouchStart}
                onMouseUp={this.onTouchEnd}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
                onWheel={this.onWheel}
            >
                <SwipeableViews
                    ref={this.swipeableViewsRef}
                    id="launchpad-carousel"
                    enableMouseEvents
                    resistance
                    style={styles.slideContainerStyle}
                    index={this.state.index}
                    onChangeIndex={index => this.setState({ index })}
                >
                    <div style={styles.slide}>slide 1</div>
                    <div
                        style={{
                            ...styles.slide
                        }}
                    >
                        <div className="launchpad-item-container" style={launchpadGridStyle}>
                            <AppLaunchpadItem appKey="order_manager" />
                            <AppLaunchpadItem appKey="crm" />
                            <AppLaunchpadItem appKey="product_manager" />
                            <AppLaunchpadItem appKey="user_center" />
                            <AppLaunchpadItem appKey="contacts" />
                            <AppLaunchpadItem appKey="preference" />
                            <AppLaunchpadItem appKey="app_manager" />
                            <AppLaunchpadItem appKey="search" />
                            <AppLaunchpadItem appKey="manual" />
                            <AppLaunchpadItem appKey="welcome" />
                        </div>
                    </div>
                    <div style={styles.slide}>slide 3</div>
                </SwipeableViews>
                <div id="launchpad-search" style={styles.searchStyle}>
                    Search
                </div>
                <div id="launchpad-navigator" style={styles.navigatorStyle}>
                    ...
                </div>
            </div>
        );
    }

    updateWindowDimensions = () => {
        this.setState({
            isViewPortVertical: window.innerHeight > window.innerWidth
        });
    };

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
        hotkeys("escape", (event, handler) => {
            if (this.props.system.launchpadStatus) {
                event.preventDefault();
                this.props.launchPadControl(false);
            }
        });
        hotkeys("left", (event, handler) => {
            if (this.state.index === 0) {
                this.swipeableViewsRef.current.containerNode.style.transform = "translate(10%,0)";
                setTimeout(() => {
                    this.swipeableViewsRef.current.containerNode.style.transform = "translate(0%,0)";
                }, 200);
                return;
            }
            this.setState({ index: this.state.index - 1 });
        });
        hotkeys("right", (event, handler) => {
            if (this.state.index === this.pages - 1) {
                this.swipeableViewsRef.current.containerNode.style.transform = `translate(${-(this.pages - 1) * 100 - 10}%,0)`;
                setTimeout(() => {
                    this.swipeableViewsRef.current.containerNode.style.transform = `translate(${-(this.pages - 1) * 100}%,0)`;
                }, 200);
                return;
            }
            this.setState({ index: this.state.index + 1 });
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ appLaunch, launchPadControl }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.user,
        apps: state.apps,
        system: state.system
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Launchpad);
