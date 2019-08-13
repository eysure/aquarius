import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import hotkeys from "hotkeys-js";
import { activateWindow, registerWindow, unregisterWindow } from "../../actions";

export const WINDOW_STATUS_INVALID = 0;
export const WINDOW_STATUS_NORMAL = 1;
export const WINDOW_STATUS_MIN = 2;
export const WINDOW_STATUS_MAX = 3;

export const WINDOW_PRIORITY_TOP = 5;
export const WINDOW_PRIORITY_HIGH = 4;
export const WINDOW_PRIORITY_NORMAL = 3;
export const WINDOW_PRIORITY_LOW = 2;
export const WINDOW_PRIORITY_BOTTOM = 1;

class Window extends Component {
    state = {
        top: "50%",
        left: "50%",
        width: this.props.width,
        height: this.props.height,
        windowStatus: WINDOW_STATUS_NORMAL,
        isActive: true,
        lastActiveTime: new Date()
    };

    id = this.props.appKey + "." + this.props._key;

    tmp_top = null;
    tmp_left = null;
    tmp_width = null;
    tmp_height = null;

    windowRef = React.createRef();
    toolbarRef = React.createRef();
    contentRef = React.createRef();

    /**
     * Render the window control buttons
     */
    renderWindowControl = () => {
        if (this.props.noControl) return null;
        return (
            <div className="window-ctrl">
                {this.props.canClose ? (
                    <button className="unhandle window-ctrl-btn btn-close" onClick={this.handleClose} onMouseDown={e => e.stopPropagation()} />
                ) : (
                    <button className="unhandle window-ctrl-btn" disabled />
                )}
                {this.props.canMinimize ? (
                    <button className="unhandle window-ctrl-btn btn-min" onClick={this.handleMin} onMouseDown={e => e.stopPropagation()} />
                ) : (
                    <button className="unhandle window-ctrl-btn" disabled />
                )}
                {this.props.canMaximize ? (
                    <button className="unhandle window-ctrl-btn btn-max" onClick={this.handleMax} onMouseDown={e => e.stopPropagation()} />
                ) : (
                    <button className="unhandle window-ctrl-btn" disabled />
                )}
            </div>
        );
    };

    /**
     * Rander head of the window
     */
    renderHead = () => {
        if (!this.props.noTitlebar && this.props.title) {
            // Both titlebar and toolbar
            return (
                <div className="window-titlebar">
                    {this.renderWindowControl()}
                    <div className="window-title" onDoubleClick={this.handleMax}>
                        {this.props.title}
                    </div>
                    {this.props.toolbar && <div className="window-toolbar">{this.props.toolbar}</div>}
                </div>
            );
        } else if (this.props.toolbar) {
            // Only toolbar (fusion title bar)
            return (
                <div className="window-titlebar window-titlebar-fusion">
                    {this.renderWindowControl()}
                    {this.props.toolbar && <div className="window-toolbar">{this.props.toolbar}</div>}
                </div>
            );
        }
    };

    /**
     * Render content (children) of the window
     */
    renderContent = () => {
        let classList = ["window-content"];
        if (this.props.titlebar && this.props.toolbar) {
            classList.push("window-content-both");
        } else if (this.props.titlebar) {
            classList.push("window-content-titlebar");
        } else if (this.props.toolbar) {
            classList.push("window-content-toolbar");
        } else {
            classList.push("window-content-full");
        }

        return (
            <div ref={this.contentRef} className={classList.join(" ")} style={this.props.contentStyle}>
                {this.props.children}
            </div>
        );
    };

    /**
     * Render resize handle if This window is resizable (this.props.canResize)
     */
    renderResizeHandle = () => {
        if (!this.props.canResize) return null;
        return (
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
        );
    };

    renderWindow = () => {
        // Window className
        let classList = ["window"];
        if (this.state.windowStatus === WINDOW_STATUS_MAX) classList.push("max");
        if (this.state.windowStatus === WINDOW_STATUS_NORMAL && this.props.canDrag) classList.push("draggable");
        if (this.state.windowStatus === WINDOW_STATUS_NORMAL && this.props.canResize) classList.push("resizable");
        if (!this.state.isActive) classList.push("inactive");
        if (this.props.theme) classList.push(this.props.theme);

        // Priority className

        return (
            <>
                {this.renderBackDrop()}
                <div
                    ref={this.windowRef}
                    id={this.props.id}
                    className={classList.join(" ")}
                    style={{
                        ...this.props.style,
                        top: this.state.top,
                        left: this.state.left,
                        width: this.state.width,
                        height: this.state.height,
                        zIndex: this.props.backDrop ? "2001" : "auto"
                    }}
                    onMouseDown={this.handleMouseDown}
                >
                    {this.renderHead()}
                    {this.renderContent()}
                    {this.renderResizeHandle()}
                    {this.props.noTitlebar && !this.props.toolbar ? this.renderWindowControl() : null}
                </div>
            </>
        );
    };

    render() {
        // Using Portal
        let appHostDOM = document.getElementById("app-host");
        if (!appHostDOM) {
            // TODO handle app-host is not loaded
            console.warn("app-host is not loaded.");
            return null;
        }
        return ReactDOM.createPortal(this.renderWindow(), appHostDOM);
    }

    renderBackDrop = () => {
        return (
            this.props.backDrop && (
                <div
                    className="backdrop"
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    onMouseDown={e => {
                        e.stopPropagation();
                    }}
                />
            )
        );
    };

    handleActivate = isActive => {
        if (isActive) this.restoreWindowPosition();
        this.setState({ isActive, lastActiveTime: isActive ? new Date() : this.state.lastActiveTime });
    };

    handleMouseDown = e => {
        if (e) e.stopPropagation();
        if (this.windowRef.current && !this.state.isActive) {
            this.props.activateWindow(this.props._key, this.props.appKey);
        }
    };

    // Move the window to the groups
    restoreWindowPosition = () => {
        let thisWindow = this.windowRef.current;
        if (!thisWindow) {
            console.error("Cannot restore window position, window is not rendered yet.");
            return;
        }

        let group = "normal-group";
        switch (this.props.windowPriority) {
            case WINDOW_PRIORITY_BOTTOM:
                group = "bottom-group";
                break;
            case WINDOW_PRIORITY_LOW:
                group = "low-group";
                break;
            case WINDOW_PRIORITY_NORMAL:
                group = "normal-group";
                break;
            case WINDOW_PRIORITY_HIGH:
                group = "high-group";
                break;
            case WINDOW_PRIORITY_TOP:
                group = "top-group";
                break;
            default:
                console.error("Invalid window priority value:", this.props.windowPriority);
                break;
        }

        let insertPlace = document.getElementById(group);
        thisWindow.parentNode.insertBefore(thisWindow, insertPlace);

        hotkeys.setScope(this.id);
    };

    handleClose = e => {
        if (this.props.onClose) this.props.onClose();
    };

    handleMin = e => {
        if (!this.props.canMinimize) return;
        // Only when this window belongs to an application can this do minimize
        let div = this.windowRef.current;
        let dockItem = document.getElementById(`di-${this.props.appKey}`);
        if (!div || !dockItem) return;

        if (this.state.windowStatus !== WINDOW_STATUS_MIN) {
            div.style.transition = "300ms ease-in";
            this.storeWindowProps(div); // Store width, height, top, left to tmp

            let divH = div.offsetHeight;
            let divW = div.offsetWidth;
            div.style.transform += " scale(0.001)";

            let diElementRect = dockItem.getClientRects();
            if (diElementRect) {
                let diX = diElementRect[0].left + diElementRect[0].width / 2 - divW / 2;
                let diY = diElementRect[0].top + diElementRect[0].height / 2 - divH / 2;
                this.setState({
                    top: diY.toFixed(0) + "px",
                    left: diX.toFixed(0) + "px",
                    windowStatus: WINDOW_STATUS_MIN
                });
            }
            this.props.activateWindow(null, this.props.appKey);
        } else {
            div.style.transition = "300ms ease-out";
            div.style.removeProperty("transform");
            this.setState({
                width: this.tmp_width,
                height: this.tmp_height,
                top: this.tmp_top,
                left: this.tmp_left,
                windowStatus: WINDOW_STATUS_NORMAL
            });
            this.props.activateWindow(this.props._key, this.props.appKey);
        }
        setTimeout(() => {
            div.style.transition = "0ms";
        }, 300);
    };

    handleMax = e => {
        if (!this.props.canMaximize) return;
        let div = this.windowRef.current;
        if (!div) return;

        div.style.transition = "300ms ease-in-out";
        if (this.state.windowStatus !== WINDOW_STATUS_MAX) {
            this.storeWindowProps(div); // Store width, height, top, left to tmp
            this.setState({
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                windowStatus: WINDOW_STATUS_MAX
            });
        } else {
            this.setState({
                width: this.tmp_width,
                height: this.tmp_height,
                top: this.tmp_top,
                left: this.tmp_left,
                windowStatus: WINDOW_STATUS_NORMAL
            });
        }
        setTimeout(() => {
            div.style.transition = "0ms";
        }, 300);
    };

    registerWindow = () => {
        this.props.registerWindow(this.props._key, this, this.props.appKey);
    };

    unregisterWindow = () => {
        this.props.unregisterWindow(this.props._key, this.props.appKey);
    };

    componentDidMount() {
        if (!this.props.appKey) {
            throw new Error("This window has no appKey set.");
        }

        // Register the window
        this.registerWindow();

        let div = this.windowRef.current;
        if (!div) return;

        // Put the window on the center of the screen
        this.setState({
            top: this.props.y || `calc(50% - ${div.offsetHeight / 2}px)`,
            left: this.props.x || `calc(50% - ${div.offsetWidth / 2}px)`
        });

        this.restoreWindowPosition();

        // Hotkeys
        hotkeys("cmd+enter,ctrl+enter", this.id, (event, handler) => {
            event.preventDefault();
            if (this.state.isActive) this.handleMax();
        });
        hotkeys("cmd+m,ctrl+m", this.id, (event, handler) => {
            event.preventDefault();
            if (this.state.isActive) this.handleMin();
        });
        hotkeys("cmd+backspace,ctrl+backspace", { scope: this.id, keydown: true }, (event, handler) => {
            event.preventDefault();
            if (this.state.isActive) this.handleClose();
        });
        hotkeys("esc", { scope: this.id, keydown: true }, (event, handler) => {
            if (!this.props.escToClose) return;
            event.preventDefault();
            event.stopPropagation();
            this.handleClose();
        });
    }

    componentWillUnmount() {
        hotkeys.unbind("cmd+enter,ctrl+enter", this.id);
        hotkeys.unbind("cmd+m,ctrl+m", this.id);
        hotkeys.unbind("cmd+m,ctrl+m", this.id);
        hotkeys.unbind("cmd+backspace,ctrl+backspace", this.id);
        hotkeys.unbind("esc", this.id);
        this.unregisterWindow();
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

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            activateWindow,
            registerWindow,
            unregisterWindow
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Window);

Window.defaultProps = {
    // Application context which enable this window do context related task
    appKey: null,

    // Width of the window
    width: "auto",

    // Height of the window
    height: "auto",

    // Initial x position of the window
    x: null,

    // Initial y position of the window
    y: null,

    // can drag
    canDrag: true,

    // can resize
    canResize: true,

    // Whether this window can be closed
    canClose: true,

    // Whether this window can maximize
    canMaximize: true,

    // Whether this window can minimize
    canMinimize: true,

    // Titlebar title
    title: null,

    // No titlebar
    noTitlebar: false,

    // Toolbar component
    toolbar: null,

    // Define the theme of the window
    theme: "light",

    // Absolute disable control buttons
    noControl: false,

    // Customize window content style
    contentStyle: null,

    // Window's priority render on screen
    windowPriority: WINDOW_PRIORITY_NORMAL,

    // Is possible to press ESC to close this window, useful for subwindows
    escToClose: false,

    // If true, use cannot do other things except finish this window
    backDrop: false
};
