import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as UI from "@material-ui/core";
import Str from "../components/string_component";

import Window from "../components/Window";
import { getAppName } from "../app_utils";

class Search extends Component {
    constructor() {
        super();
        this.state = {
            open: true,
            searchInput: ""
        };
    }

    searchBarInput = {
        width: "100%",
        height: 36,
        border: "none",
        outline: "none",
        fontSize: "1.2em",
        background: "none"
    };

    searchBarContainer = {
        height: 36,
        paddingLeft: 36,
        paddingRight: 12,
        display: "flex",
        alignItems: "center"
    };

    searchBarIcon = {
        position: "absolute",
        top: 8,
        left: 8,
        color: "grey",
        width: 20,
        height: 20
    };

    handleKey(evt) {
        this.setState({ searchInput: evt.target.value });
        evt.preventDefault();
    }

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                key="Main"
                _key="Main"
                appKey={this.props.appKey}
                y={"10vh"}
                width={600}
                title={"Search"}
                noControl
                escToClose
                onClose={e => this.setState({ open: false })}
            >
                <UI.Icon style={this.searchBarIcon}>search</UI.Icon>
                <UI.DialogContent className="handle no-padding">
                    <div style={this.searchBarContainer}>
                        <input className="unhandle" autoFocus onChange={this.handleKey.bind(this)} value={this.state.searchInput} style={this.searchBarInput} />
                    </div>
                    <UI.Divider />
                    <div>
                        <UI.ListItem button>
                            <UI.ListItemText primary="Version" secondary="0.0.1" />
                        </UI.ListItem>
                        <UI.ListItem button>
                            <UI.ListItemText primary="Version" secondary="0.0.1" />
                        </UI.ListItem>
                    </div>
                </UI.DialogContent>
            </Window>
        );
    }
}

Search.manifest = {
    appKey: "search",
    appName: ["Search", "搜索"],
    icon: "/assets/apps/binoculars.svg"
};

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
