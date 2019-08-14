import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Mongo } from "meteor/mongo";

import { R } from "./index";
import * as AQUI from "../../components/Window/core";
import Menu from "../../components/Menus";
import { activateWindow } from "../../actions";
import CustomerDetail from "./customer_detail";
import CustomerNew from "./customer_new";

class Customers extends Component {
    state = {
        customerTableContextMenu: false,
        customerTableContextMenuSelect: null,
        contextMenuX: 0,
        contextMenuY: 0,
        renderedCustomerDetails: [],
        query: "",
        renderedNewCustomer: false
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <div className="h-full v-full">
                <div className="handle roof-toolbar">
                    <div className="hbc h-full">
                        <div className="hcc">
                            <button className="roof-toolbar-btn material-icons" onClick={e => this.setState({ renderedNewCustomer: true })}>
                                person_add
                            </button>
                        </div>
                        <div className="hcc">
                            <input className="toolbar-input" name="query" value={this.state.query} onChange={this.handleChange} />
                        </div>
                    </div>
                </div>
                <div style={{ height: "calc(100% - 38px)", overflow: "auto" }}>
                    <AQUI.Table
                        heads={["abbr", "name", "country", "type", "address", "tel", "website", "fax", "time_created", "time_modified", "name_cn", "remark"]}
                        headsHide={["address", "tel", "website", "fax", "time_modified", "name_cn", "remark"]}
                        headsTranslator={R}
                        data={this.props.db.customers}
                        dataTranslator={{
                            time_created: val => {
                                return new Date(val).toLocaleString();
                            },
                            time_modified: val => {
                                return new Date(val).toLocaleString();
                            },
                            country: val => {
                                return R.Str(val);
                            },
                            type: val => {
                                return R.Str(`type_${val}`);
                            }
                        }}
                        rowDoubleClick={(e, row) => {
                            this.openCustomer(row._id);
                        }}
                        rowContextMenu={(e, row) => {
                            e.preventDefault();
                            this.setState({
                                customerTableContextMenu: true,
                                contextMenuX: e.clientX,
                                contextMenuY: e.clientY,
                                customerTableContextMenuSelect: row
                            });
                        }}
                        sortBy="name"
                        asc={true}
                    />
                </div>
                {this.renderNewCustomer()}
                {this.renderCustomerDetails()}
                {this.renderTableContextMenu()}
            </div>
        );
    }

    renderNewCustomer = () => {
        if (!this.state.renderedNewCustomer) return;

        let id = new Mongo.ObjectID();
        return (
            <CustomerNew
                key={id._str}
                context={this.props.context}
                id={id}
                onClose={e => {
                    this.setState({ renderedNewCustomer: false });
                }}
            />
        );
    };

    renderCustomerDetails = () => {
        let windows = [];
        for (let id of this.state.renderedCustomerDetails) {
            windows.push(
                <CustomerDetail
                    key={id._str}
                    context={this.props.context}
                    id={id}
                    onClose={e => {
                        let customers = this.state.renderedCustomerDetails;
                        customers.splice(customers.indexOf(id), 1);
                        this.setState({ renderedCustomerDetails: customers });
                    }}
                />
            );
        }
        return windows;
    };

    openCustomer = id => {
        if (this.state.renderedCustomerDetails.includes(id)) {
            this.props.activateWindow(this.props.context.props.appKey, id._str);
        } else this.setState({ renderedCustomerDetails: [...this.state.renderedCustomerDetails, id] });
    };

    renderTableContextMenu = () => {
        let row = this.state.customerTableContextMenuSelect;
        let customerTableContextMenu = [
            {
                title: R.Str("OPEN"),
                onClick: e => {
                    this.openCustomer(row._id);
                }
            }
        ];
        let menu = (
            <Menu context={this} name="customerTableContextMenu" x={this.state.contextMenuX} y={this.state.contextMenuY} content={customerTableContextMenu} />
        );
        return ReactDOM.createPortal(menu, document.getElementById("menu-container"));
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ activateWindow }, dispatch);
}

function mapStateToProps(state) {
    return {
        db: state.db
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Customers);
