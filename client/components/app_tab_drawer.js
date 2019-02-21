import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import _ from "lodash";
import { getTabName, getTabIcon } from "../app_utils";

class AppTabDrawer extends Component {
    handleTabSwitch = tabKey => {
        console.log("Tab '" + tabKey + "' is clicked.");
    };

    renderTabList() {
        let appStaticProps = this.props.appStaticProps;

        return _.map(appStaticProps.tabs, tab => {
            return (
                <UI.ListItem key={tab.tabKey} button selected={false} onClick={() => this.handleTabSwitch(tab.tabKey)}>
                    <UI.ListItemIcon>
                        <UI.Icon>{getTabIcon(appStaticProps.appKey, tab.tabKey, this.props.user)}</UI.Icon>
                    </UI.ListItemIcon>
                    <UI.ListItemText>{getTabName(appStaticProps.appKey, tab.tabKey, this.props.user)}</UI.ListItemText>
                </UI.ListItem>
            );
        });
    }

    render() {
        return (
            <UI.Drawer
                PaperProps={{
                    style: {
                        borderRadius: "6px 0 0 6px",
                        backgroundColor: "#eee"
                    }
                }}
                variant="permanent"
                anchor="left"
            >
                <div className="handle" style={{ height: "36px" }} />
                <UI.List style={{ height: "calc(100% - 36px)", overflowY: "auto" }}>{this.renderTabList()}</UI.List>
            </UI.Drawer>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            /* Actions */
        },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppTabDrawer);
