import React from "react";
import LaunchpadItem from "./launchpad_item";
import hotkeys from "hotkeys-js";
import PropTypes from "prop-types";

export default class Launchpad extends React.Component {
    state = {
        index: 0,
        isViewPortVertical: false
    };

    renderLaunchpadPages = () => {
        let launchpadGridStyle = {
            gridTemplateColumns: `repeat(${this.state.isViewPortVertical ? 5 : 7}, 16vmin)`
        };
        let pageList = [];
        if (!this.props.items || this.props.items.length === 0) return pageList;
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
            return <LaunchpadItem key={item.appKey} {...item} close={this.props.close} />;
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
            <div id="launchpad" className="launchpad-enter" onContextMenu={e => e.preventDefault()} onMouseUp={this.props.close}>
                {/* <SwipeableViews
                    ref={this.swipeableViewsRef}
                    id="launchpad-carousel"
                    resistance
                    index={this.state.index}
                    onChangeIndex={index => this.setState({ index })}
                >
                    
                </SwipeableViews> */}

                {this.renderLaunchpadPages()}

                <div id="launchpad-navigator">{this.renderLaunchpadNavigator()}</div>
            </div>
        );
    }

    // navigateTo = index => {
    //     this.setState({ index });
    // };

    updateWindowDimensions = () => {
        this.setState({
            isViewPortVertical: window.innerHeight > window.innerWidth
        });
    };

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
        hotkeys("escape", () => {
            if (this.props.open) this.props.close();
        });
        // hotkeys("left", () => {
        //     if (this.state.index === 0) {
        //         this.swipeableViewsRef.current.containerNode.style.transform = "translate(10%,0)";
        //         setTimeout(() => {
        //             this.swipeableViewsRef.current.containerNode.style.transform = "translate(0%,0)";
        //         }, 200);
        //         return;
        //     }
        //     this.setState({ index: this.state.index - 1 });
        // });
        // hotkeys("right", () => {
        //     if (this.state.index === this.pages - 1) {
        //         this.swipeableViewsRef.current.containerNode.style.transform = `translate(${-(this.pages - 1) * 100 - 10}%,0)`;
        //         setTimeout(() => {
        //             this.swipeableViewsRef.current.containerNode.style.transform = `translate(${-(this.pages - 1) * 100}%,0)`;
        //         }, 200);
        //         return;
        //     }
        //     this.setState({ index: this.state.index + 1 });
        // });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }
}

Launchpad.propTypes = {
    items: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};
