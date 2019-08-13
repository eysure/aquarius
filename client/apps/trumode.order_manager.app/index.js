import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";

import OrderList from "./order_list";
import OrderDetail from "./order_detail";

import Window from "../../components/Window";

import { throwMsg } from "../../actions";

import { ResourceFeeder } from "../../resources_feeder";
export const R = new ResourceFeeder(require("./resources/strings"), require("./resources/messages"));

class OrderManager extends Component {
    state = {
        open: true,
        sidebarWidth: 240,
        secondarySidebarWidth: 360,
        secondarySidebarWidthOri: 360,
        salesOrderGroupOpen: true,
        purchaseOrderGroupOpen: true,
        adjustWidthStart: false,
        adjustWidthStartX: 0
    };

    sidebarStyle = {
        backgroundColor: "#1D222D",
        width: `${this.state.sidebarWidth}px`,
        border: "0"
    };

    adjustWidthStart = e => {
        this.setState({ adjustWidthStart: true, adjustWidthStartX: e.clientX });
    };

    adjustWidthMove = e => {
        if (this.state.adjustWidthStart) {
            this.setState({
                secondarySidebarWidth: this.state.secondarySidebarWidthOri + e.clientX - this.state.adjustWidthStartX
            });
        }
    };

    adjustWidthEnd = () => {
        this.setState({
            adjustWidthStart: false,
            secondarySidebarWidthOri: this.state.secondarySidebarWidth
        });
    };

    componentDidMount = () => {
        this.props.throwMsg(R.Msg("APP_NOT_READY"));
    };

    render() {
        if (!this.state.open) return null;
        return (
            <Window
                key="Main"
                _key="Main"
                width="80vw"
                height="80vh"
                appKey={this.props.appKey}
                title={R.Trans(OrderManager.manifest.appName)}
                noTitlebar
                theme="dark"
                onClose={e => this.setState({ open: false })}
            >
                <UI.DialogContent className="no-padding" onMouseMove={this.adjustWidthMove} onMouseUp={this.adjustWidthEnd}>
                    <UI.Drawer className="dark" variant="permanent" anchor="left" PaperProps={{ style: this.sidebarStyle }}>
                        <div className="handle" style={{ height: "36px" }} />

                        <UI.ListItem
                            button
                            onClick={() =>
                                this.setState({
                                    salesOrderGroupOpen: !this.state.salesOrderGroupOpen
                                })
                            }
                        >
                            <UI.ListItemIcon>
                                <i className="material-icons">{R.Str("SALES_ORDER_ICON")}</i>
                            </UI.ListItemIcon>
                            <UI.ListItemText primary={R.Str("SALES_ORDER")} />
                            <i className="material-icons">{this.state.salesOrderGroupOpen ? "expand_less" : "expand_more"}</i>
                        </UI.ListItem>

                        <UI.Collapse in={this.state.salesOrderGroupOpen} timeout="auto" unmountOnExit>
                            <UI.List className="list-nested">
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <i className="material-icons">select_all</i>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={R.Str("ALL_ORDERS")} />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <i className="material-icons">assignment_ind</i>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={R.Str("MY_ORDERS")} />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <i className="material-icons">assignment</i>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={R.Str("GROUP_ORDERS")} />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <i className="material-icons">star</i>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={R.Str("BOOKMARK_ORDERS")} />
                                </UI.ListItem>
                            </UI.List>
                        </UI.Collapse>

                        <UI.ListItem
                            button
                            onClick={() =>
                                this.setState({
                                    purchaseOrderGroupOpen: !this.state.purchaseOrderGroupOpen
                                })
                            }
                        >
                            <UI.ListItemIcon>
                                <i className="material-icons">{R.Str("PURCHASE_ORDER_ICON")}</i>
                            </UI.ListItemIcon>
                            <UI.ListItemText primary={R.Str("PURCHASE_ORDER")} />
                            <i className="material-icons">{this.state.purchaseOrderGroupOpen ? "expand_less" : "expand_more"}</i>
                        </UI.ListItem>

                        <UI.Collapse in={this.state.purchaseOrderGroupOpen} timeout="auto" unmountOnExit>
                            <UI.List className="list-nested">
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <i className="material-icons">select_all</i>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={R.Str("ALL_ORDERS")} />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <i className="material-icons">assignment_ind</i>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={R.Str("MY_ORDERS")} />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <i className="material-icons">assignment</i>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={R.Str("GROUP_ORDERS")} />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <i className="material-icons">star</i>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={R.Str("BOOKMARK_ORDERS")} />
                                </UI.ListItem>
                            </UI.List>
                        </UI.Collapse>
                    </UI.Drawer>

                    <UI.Drawer
                        variant="permanent"
                        anchor="left"
                        PaperProps={{
                            style: {
                                left: `${this.state.sidebarWidth}px`,
                                width: `${this.state.secondarySidebarWidth}px`,
                                border: "0"
                            }
                        }}
                    >
                        <OrderList />
                    </UI.Drawer>

                    <UI.Drawer
                        variant="permanent"
                        anchor="left"
                        PaperProps={{
                            style: {
                                backgroundColor: "lightGrey",
                                left: `${this.state.sidebarWidth + this.state.secondarySidebarWidth}px`,
                                width: "1px",
                                border: "0",
                                cursor: "col-resize"
                            }
                        }}
                        onMouseDown={this.adjustWidthStart}
                    />

                    <UI.Drawer
                        variant="permanent"
                        anchor="left"
                        PaperProps={{
                            style: {
                                backgroundColor: "#F5F4F6",
                                borderRadius: "0 6px 6px 0",
                                left: `${this.state.sidebarWidth + this.state.secondarySidebarWidth + 1}px`,
                                width: `calc(100% - ${this.state.sidebarWidth + this.state.secondarySidebarWidth + 1}px)`,
                                border: "0"
                            }
                        }}
                    >
                        <OrderDetail width={`calc(100% - ${this.state.sidebarWidth + this.state.secondarySidebarWidth + 1}px)`} />
                    </UI.Drawer>
                </UI.DialogContent>
            </Window>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => bindActionCreators({ throwMsg }, dispatch);

OrderManager.manifest = {
    appKey: "trumode.order_manager",
    appName: ["Order Manager", "订单管理"],
    icon: "/assets/apps/documents.svg"
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderManager);
