import React from "react";
import SwipeableViews from "react-swipeable-views";
import LaunchpadItem from "./launchpad_item";

export default class Launchpad extends React.Component {
    state = {
        index: 0,
        isViewPortVertical: false,
        canDrag: true
    };

    launchpadRef = React.createRef();

    swipeableViewsRef = React.createRef();

    pointerMoved = [null, null];

    onTouchStart = e => {
        console.log("start");
        if (e.button === 1) {
            this.close();
            return;
        }
        this.pointerMoved = [];
        this.pointerMoved[0] = e.touches ? [e.touches[0].pageX, e.touches[0].pageY] : [e.clientX, e.clientY];
    };
    onTouchMove = e => {
        console.log("move");
        this.pointerMoved[1] = [e.touches[0].pageX, e.touches[0].pageY];
    };
    onTouchEnd = e => {
        console.log("end");
        if (!this.pointerMoved[0]) return;
        if (e.button === 1) return;
        if (e.clientX || e.clientY) this.pointerMoved[1] = [e.clientX, e.clientY];
        if (!this.pointerMoved[1]) {
            this.close();
            return;
        }
        let dist = Math.pow(this.pointerMoved[0][0] - this.pointerMoved[1][0], 2) + Math.pow(this.pointerMoved[0][1] - this.pointerMoved[1][1], 2);
        if (dist < 36) {
            this.close();
        }
    };

    close = () => {
        let launchpad = this.launchpadRef.current;
        launchpad.classList.remove("launchpad-enter");
        let eventListener = () => {
            launchpad.classList.remove("launchpad-close");
            launchpad.removeEventListener("animationend", eventListener);
            this.props.close();
        };
        launchpad.classList.add("launchpad-close");
        launchpad.addEventListener("animationend", eventListener);
    };

    renderLaunchpadPages = () => {
        let launchpadGridStyle = {
            gridTemplateColumns: `repeat(${this.state.isViewPortVertical ? 5 : 7}, 16vmin)`
        };

        let pageList = [];
        for (let i = 0; i < this.pages; i++) {
            pageList.push(
                <div key={`page${i}`} className="launchpad-page">
                    <div className="launchpad-grid" style={launchpadGridStyle}>
                        {this.renderLaunchpadItems(this.props.items.slice(i * 35, (i + 1) * 35))}
                    </div>
                </div>
            );
        }
        return pageList;
    };

    renderLaunchpadItems = items => {
        if (!items || items.length === 0) return null;
        return items.map(item => {
            return <LaunchpadItem key={item.appKey} {...item} />;
        });
    };

    renderLaunchpadNavigator = () => {
        let navigatorList = [];
        for (let i = 0; i < this.pages; i++) {
            let classList = ["launchpad-navigator-button"];
            if (i === this.state.index) classList.push("active");
            navigatorList.push(<div key={`nav${i}`} className={classList.join(" ")} onClick={() => this.navigateTo(i)} />);
        }
        return navigatorList;
    };

    render() {
        if (!this.props.open) return null;

        // Computing pages needed
        if (!this.props.items || this.props.items.length === 0) this.pages = 1;
        else this.pages = Math.floor((this.props.items.length - 1) / 35) + 1;

        return (
            <div
                id="launchpad"
                className="launchpad-enter"
                ref={this.launchpadRef}
                onContextMenu={e => e.preventDefault()}
                onMouseDown={this.onTouchStart}
                onMouseUp={this.onTouchEnd}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
            >
                <SwipeableViews
                    ref={this.swipeableViewsRef}
                    id="launchpad-carousel"
                    enableMouseEvents
                    resistance
                    index={this.state.index}
                    onChangeIndex={index => this.setState({ index })}
                >
                    {this.renderLaunchpadPages()}
                </SwipeableViews>
                <div id="launchpad-search">Search</div>
                <div id="launchpad-navigator">{this.renderLaunchpadNavigator()}</div>
            </div>
        );
    }

    navigateTo = index => {
        this.setState({ index });
    };

    updateWindowDimensions = () => {
        this.setState({
            isViewPortVertical: window.innerHeight > window.innerWidth
        });
    };

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
        hotkeys("escape", (event, handler) => {
            if (this.props.open) this.close();
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
