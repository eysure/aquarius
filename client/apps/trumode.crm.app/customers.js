import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { activateWindow } from "../../actions";
import Menu from "../../components/Menus";
import * as AQUI from "../../components/Window/core";
import CustomerDetail from "./customer_detail";
import CustomerNew from "./customer_new";
import { R } from "./index";

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
                            <button className="roof-toolbar-btn material-icons" onClick={() => this.setState({ renderedNewCustomer: true })}>
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
                        heads={[
                            "abbr",
                            "name",
                            "country",
                            "type",
                            "address",
                            "tel",
                            "website",
                            "fax",
                            "time_created",
                            "time_modified",
                            "name_cn",
                            "remark",
                            "tags"
                        ]}
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

        return (
            <CustomerNew
                appKey={this.props.appKey}
                onClose={() => {
                    this.setState({ renderedNewCustomer: false });
                }}
            />
        );
    };

    renderCustomerDetails = () => {
        let windows = [];
        for (let customerId of this.state.renderedCustomerDetails) {
            windows.push(
                <CustomerDetail
                    key={customerId._str}
                    appKey={this.props.appKey}
                    customerId={customerId}
                    onClose={() => {
                        let customers = this.state.renderedCustomerDetails;
                        customers.splice(customers.indexOf(customerId), 1);
                        this.setState({ renderedCustomerDetails: customers });
                    }}
                />
            );
        }
        return windows;
    };

    openCustomer = id => {
        if (this.state.renderedCustomerDetails.includes(id)) {
            this.props.activateWindow(this.props.appKey, id._str);
        } else this.setState({ renderedCustomerDetails: [...this.state.renderedCustomerDetails, id] });
    };

    renderTableContextMenu = () => {
        let row = this.state.customerTableContextMenuSelect;
        let customerTableContextMenu = [
            {
                title: R.Str("OPEN"),
                onClick: () => {
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

Customers.propTypes = {
    appKey: PropTypes.string.isRequired,
    db: PropTypes.object.isRequired,
    activateWindow: PropTypes.func.isRequired
};
