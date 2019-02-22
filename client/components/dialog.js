import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import _ from "lodash";
import uuidv4 from "uuid/v4";

import { appWindowActivate, appClose, appConfig } from "../actions";
import { getLanguage } from "./string_component";
import hotkeys from "hotkeys-js";

class Window extends Component {
    static defaultProps = {
        appProps: null,
        width: "auto",
        height: "auto",
        drag: true,
        resize: true
    };

    state = {
        width: this.props.width,
        height: this.props.height,
        top: "50%",
        left: "50%"
    };

    tmp_top = null;
    tmp_left = null;
    tmp_width = null;
    tmp_height = null;

    constructor(props) {
        super(props);
        this.id = this.props.id || uuidv4();
    }

    windowRef = React.createRef();
    toolbarRef = React.createRef();
    contentRef = React.createRef();

    render() {
        let { appProps } = this.props;

        // Window className
        let classNames = ["window", "rnd"];
        let isActive = _.get(this.props, "appProps.isActive", true);
        let windowStatus = ["hidden", "normal", "min", "max"][this.props.appProps.status];
        classNames.push(windowStatus);
        classNames.push(isActive ? "active" : "inactive");
        classNames.push(this.props.titleBarStyle || "default"); // [none, fusion, (default)]
        classNames.push(this.props.className);

        // Titlebar className
        let titlebarClassNames = ["titlebar"];
        if (windowStatus === "normal") titlebarClassNames.push("handle");

        // Content className
        let contentClassNames = ["content"];
        if (this.props.layout) contentClassNames.push(this.props.layout);

        return (
            <div
                ref={this.windowRef}
                id={this.props.id}
                className={classNames.join(" ")}
                style={{
                    ...this.props.style,
                    top: this.state.top,
                    left: this.state.left,
                    width: this.state.width,
                    height: this.state.height,
                    filter: `blur(${this.props.system.blurScreen || 0}px)`
                }}
                onClose={this.handleClose}
                onMouseDown={() => {
                    if (!isActive) this.props.appWindowActivate(appProps.key, appProps.option);
                }}
            >
                <div className={titlebarClassNames.join(" ")}>
                    <div className="titlebar-firstline">
                        <div className="window-ctrl">
                            <button className="unhandle window-ctrl-btn btn-close" onClick={this.handleClose} />
                            <button className="unhandle window-ctrl-btn btn-min" onClick={this.handleMin} />
                            <button className="unhandle window-ctrl-btn btn-max" onClick={this.handleMax} />
                        </div>

                        <div className="titlebar-title">{appProps ? appProps.appStaticProps.appName[getLanguage(this.props.user)] : null}</div>
                    </div>
                    <div className="toolbar" ref={this.toolbarRef}>
                        {this.props.toolbar}
                    </div>
                </div>
                <div
                    ref={this.contentRef}
                    className={contentClassNames.join(" ")}
                    style={{
                        height: `calc(100% - ${
                            this.toolbarRef.current
                                ? this.toolbarRef.current.offsetHeight + this.contentRef.current
                                    ? this.contentRef.current
                                    : 0
                                : this.contentRef.current
                                ? this.contentRef.current
                                : 0
                        }px)`
                    }}
                >
                    {this.props.children}
                </div>
                <span className="unselectable">
                    <div className="dialog-resizer dialog-resizer-uu interactive-uu" />
                    <div className="dialog-resizer dialog-resizer-rr interactive-rr" />
                    <div className="dialog-resizer dialog-resizer-dd interactive-dd" />
                    <div className="dialog-resizer dialog-resizer-ll interactive-ll" />
                    <div className="dialog-resizer dialog-resizer-lu interactive-ll interactive-uu" />
                    <div className="dialog-resizer dialog-resizer-ru interactive-rr interactive-uu" />
                    <div className="dialog-resizer dialog-resizer-ld interactive-ll interactive-dd" />
                    <div className="dialog-resizer dialog-resizer-rd interactive-rr interactive-dd" />
                </span>
            </div>
        );
    }

    componentDidMount() {
        let div = this.windowRef.current;
        if (!div) return;

        this.setState({
            top: `calc(50% - ${div.offsetHeight / 2}px)`,
            left: `calc(50% - ${div.offsetWidth / 2}px)`
        });

        hotkeys("cmd+enter,ctrl+enter", (event, handler) => {
            event.preventDefault();
            if (_.get(this.props, "appProps.isActive", false)) this.handleMax();
        });
    }

    handleClose = e => {
        this.props.appClose(this.props.appProps.key);
    };

    handleMin = e => {
        let div = this.windowRef.current;
        if (!div) return;

        div.style.transition = "200ms";
        if (this.props.appProps.status !== 2) {
            this.storeWindowProps(div); // Store width, height, top, left to tmp

            let divH = div.offsetHeight;
            let divW = div.offsetWidth;
            div.style.transform += " scale(0.001)";
            let dockItem = document.getElementById(`di-${this.props.appProps.key}`);
            let diElementRect = dockItem.getClientRects();
            if (diElementRect) {
                let diX = diElementRect[0].left + diElementRect[0].width / 2 - divW / 2;
                let diY = diElementRect[0].top + diElementRect[0].height / 2 - divH / 2;
                this.setState({
                    top: diY.toFixed(0) + "px",
                    left: diX.toFixed(0) + "px"
                });
                div.style.opacity = "0";
            }

            this.props.appConfig(this.props.appProps.key, { status: 2 });
        }
        setTimeout(() => {
            div.style.transition = "0ms";
        }, 200);
    };

    handleMax = e => {
        let div = this.windowRef.current;
        if (!div) return;

        div.style.transition = "200ms";
        if (this.props.appProps.status !== 3) {
            this.storeWindowProps(div); // Store width, height, top, left to tmp
            this.setState({
                // Maximize
                width: "100%",
                height: "100%",
                top: 0,
                left: 0
            });
            this.props.appConfig(this.props.appProps.key, { status: 3 });
        } else {
            this.setState({
                width: this.tmp_width,
                height: this.tmp_height,
                top: this.tmp_top,
                left: this.tmp_left
            });
            this.props.appConfig(this.props.appProps.key, { status: 1 });
        }
        setTimeout(() => {
            div.style.transition = "0ms";
        }, 200);
    };

    componentDidUpdate(prevProps) {
        let div = this.windowRef.current;
        if (!div) return;
        // Recover from minimize
        if (prevProps.appProps.status === 2 && this.props.appProps.status === 1) {
            div.style.transition = "200ms";
            this.setState({
                width: this.tmp_width,
                height: this.tmp_height,
                top: this.tmp_top,
                left: this.tmp_left
            });
            div.style.opacity = "1";
            div.style.removeProperty("transform");
            setTimeout(() => {
                div.style.transition = "0ms";
            }, 200);
        }
    }

    storeWindowProps = div => {
        // Store the tamporary values
        this.tmp_width = div.offsetWidth;
        this.tmp_height = div.offsetHeight;
        this.tmp_top = div.offsetTop + parseInt(div.dataset.y || 0);
        this.tmp_left = div.offsetLeft + parseInt(div.dataset.x || 0);
        // Clear the rnd values
        div.removeAttribute("data-x");
        div.removeAttribute("data-y");
        div.style.removeProperty("transform");
    };
}

function mapStateToProps(state) {
    return {
        apps: state.apps,
        user: state.user,
        system: state.system
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ appWindowActivate, appClose, appConfig }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Window);
