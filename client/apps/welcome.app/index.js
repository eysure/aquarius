import React, { Component } from "react";

import { ResourceFeeder } from "../../resources_feeder";
const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));
import SwipeableViews from "react-swipeable-views";

import Window from "../../components/dialog";

class Welcome extends Component {
    state = { index: 0 };
    static appStaticProps = {
        appName: ["Welcome", "欢迎"],
        icon: "/assets/apps/cardiology.svg"
    };

    render() {
        return (
            <Window appProps={this.props.appProps} width={"60vw"} height={"60vh"} titleBarStyle={"fusion"}>
                <SwipeableViews
                    id="welcome-carousel"
                    className="carousel"
                    enableMouseEvents
                    resistance
                    index={this.state.index}
                    onChangeIndex={index => this.setState({ index })}
                >
                    {this.pages}
                </SwipeableViews>
                <div className="carousel-ctrl">
                    <button
                        onClick={() => {
                            this.setState({ index: Math.max(0, this.state.index - 1) });
                        }}
                    >
                        <i className="material-icons">keyboard_arrow_left</i>
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ index: Math.min(this.pages.length - 1, this.state.index + 1) });
                        }}
                    >
                        <i className="material-icons">keyboard_arrow_right</i>
                    </button>
                </div>
            </Window>
        );
    }

    pages = [
        <div key="welcome-page-1" className="page">
            Welcome
        </div>,
        <div key="welcome-page-2" className="page">
            slide 2
        </div>,
        <div key="welcome-page-3" className="page">
            slide 3
        </div>,
        <div key="welcome-page-4" className="page">
            slide 4
        </div>
    ];
}

export default Welcome;
