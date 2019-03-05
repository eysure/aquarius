import React, { Component } from "react";
import MenuBar from "./menu_bar";
import Launchpad from "./launchpad";
import Dock from "./dock";

export default class MainFrame extends Component {
    render() {
        return (
            <>
                <MenuBar />
                <Launchpad />
                <Dock />
            </>
        );
    }
}
