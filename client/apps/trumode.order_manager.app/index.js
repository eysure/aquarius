import React, { Component } from "react";
import * as UI from "@material-ui/core";
import Str from "../../components/string_component";

import Window from "../../components/dialog";
import OrderList from "./order_list";
import OrderDetail from "./order_detail";

class OrderManager extends Component {
    static appStaticProps = {
        appName: ["Order Manager", "订单管理"],
        icon: "/assets/apps/documents.svg"
    };

    state = {
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

    render() {
        return (
            <Window appProps={this.props.appProps} titleBarStyle="fusion" width="80vw" height="80vh">
                <UI.DialogContent
                    className="no-padding"
                    onMouseMove={this.adjustWidthMove}
                    onMouseUp={this.adjustWidthEnd}
                >
                    <UI.Drawer
                        className="dark"
                        variant="permanent"
                        anchor="left"
                        PaperProps={{ style: this.sidebarStyle }}
                    >
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
                                <UI.Icon>
                                    <Str SALES_ORDER_ICON />
                                </UI.Icon>
                            </UI.ListItemIcon>
                            <UI.ListItemText primary={<Str SALES_ORDER />} />
                            <UI.Icon>{this.state.salesOrderGroupOpen ? "expand_less" : "expand_more"}</UI.Icon>
                        </UI.ListItem>

                        <UI.Collapse in={this.state.salesOrderGroupOpen} timeout="auto" unmountOnExit>
                            <UI.List className="list-nested">
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <UI.Icon>select_all</UI.Icon>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={<Str ALL_ORDERS />} />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <UI.Icon>assignment_ind</UI.Icon>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={<Str MY_ORDERS />} />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <UI.Icon>assignment</UI.Icon>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={<Str GROUP_ORDERS />} />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <UI.Icon>star</UI.Icon>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary={<Str BOOKMARK_ORDERS />} />
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
                                <UI.Icon>
                                    <Str PURCHASE_ORDER_ICON />
                                </UI.Icon>
                            </UI.ListItemIcon>
                            <UI.ListItemText primary={<Str PURCHASE_ORDER />} />
                            <UI.Icon>{this.state.purchaseOrderGroupOpen ? "expand_less" : "expand_more"}</UI.Icon>
                        </UI.ListItem>

                        <UI.Collapse in={this.state.purchaseOrderGroupOpen} timeout="auto" unmountOnExit>
                            <UI.List className="list-nested">
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <UI.Icon>apps</UI.Icon>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary="Inbox" />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <UI.Icon>apps</UI.Icon>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary="Inbox" />
                                </UI.ListItem>
                                <UI.ListItem button className="li-nested">
                                    <UI.ListItemIcon>
                                        <UI.Icon>apps</UI.Icon>
                                    </UI.ListItemIcon>
                                    <UI.ListItemText primary="Inbox" />
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
                                width: `calc(100% - ${this.state.sidebarWidth +
                                    this.state.secondarySidebarWidth +
                                    1}px)`,
                                border: "0"
                            }
                        }}
                    >
                        <OrderDetail
                            width={`calc(100% - ${this.state.sidebarWidth + this.state.secondarySidebarWidth + 1}px)`}
                        />
                    </UI.Drawer>
                </UI.DialogContent>
            </Window>
        );
    }
}

export default OrderManager;
