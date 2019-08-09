import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as AQUI from "../../components/Window/core";
import { R } from "./index";

import CustomerDetail from "./customer_detail";

class Customers extends Component {
    state = {
        renderedCustomerDetails: []
    };
    render() {
        return (
            <div className="h-full v-full">
                <div className="roof-toolbar handle">Toolbar</div>
                <div style={{ height: "calc(100% - 38px)", overflow: "auto" }}>
                    <AQUI.Table
                        heads={["abbr", "name", "country", "type", "address", "tel", "website", "fax", "create_date", "name_cn"]}
                        headsHide={["address", "tel", "website", "fax", "create_date", "name_cn"]}
                        headsTranslator={R}
                        data={this.props.db.customers}
                        dataTranslator={{
                            create_date: val => {
                                return new Date(val).toLocaleString();
                            }
                        }}
                        rowClick={(e, row) => {
                            console.log("rowClick", row);
                        }}
                        rowDoubleClick={(e, row) => {
                            this.setState({ renderedCustomerDetails: [...this.state.renderedCustomerDetails, row] });
                        }}
                        rowContextMenu={(e, row) => {
                            e.preventDefault();
                            console.log("rowContextMenu", row);
                        }}
                    />
                </div>
                {this.renderCustomerDetails()}
            </div>
        );
    }

    renderCustomerDetails = () => {
        let windows = [];
        for (let row of this.state.renderedCustomerDetails) {
            windows.push(
                <CustomerDetail
                    key={row._id.toString()}
                    context={this.props.context}
                    customer={row}
                    onClose={e => {
                        let customers = this.state.renderedCustomerDetails;
                        customers.splice(customers.indexOf(row), 1);
                        this.setState({ renderedCustomerDetails: customers });
                    }}
                />
            );
        }
        return windows;
    };

    componentDidMount() {
        document.getElementsByTagName("table")[0].addEventListener("scroll", function() {
            var translate = "translate(0," + this.scrollTop + "px)";
            var myElements = this.querySelectorAll("thead");
            for (var i = 0; i < myElements.length; i++) {
                myElements[i].style.transform = translate;
            }
        });
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
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
