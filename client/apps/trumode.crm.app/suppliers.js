import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { activateWindow } from "../../actions";
import Menu from "../../components/Menus";
import * as AQUI from "../../components/Window/core";
import SupplierDetail from "./supplier_detail";
import SupplierNew from "./supplier_new";
import { R } from "./index";

class Suppliers extends Component {
    state = {
        supplierTableContextMenu: false,
        supplierTableContextMenuSelect: null,
        contextMenuX: 0,
        contextMenuY: 0,
        renderedSupplierDetails: [],
        query: "",
        renderedNewSupplier: false
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
                            <button className="aqui-toolbar-btn" onClick={() => this.setState({ renderNewSupplier: true })}>
                                <i className="material-icons">person_add</i>
                            </button>
                        </div>
                        <div className="hcc">
                            <input
                                className="aqui-toolbar-btn"
                                name="query"
                                value={this.state.query}
                                onChange={this.handleChange}
                                placeholder={R.get("SEARCH")}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ height: "calc(100% - 38px)", overflow: "auto" }}>
                    <AQUI.Table
                        heads={["abbr", "name", "tel", "fax", "country", "state", "city", "address", "time_created", "time_modified", "remark"]}
                        headsHide={["address", "tel", "website", "fax", "time_created", "time_modified", "remark"]}
                        headsTranslator={R}
                        data={this.props.db.suppliers}
                        dataTranslator={{
                            time_created: val => {
                                return new Date(val).toLocaleString();
                            },
                            time_modified: val => {
                                return new Date(val).toLocaleString();
                            },
                            country: val => {
                                return R.get(val);
                            },
                            type: val => {
                                return R.get(`type_${val}`);
                            }
                        }}
                        rowDoubleClick={(e, row) => {
                            this.openSupplier(row._id);
                        }}
                        rowContextMenu={(e, row) => {
                            e.preventDefault();
                            this.setState({
                                supplierTableContextMenu: true,
                                contextMenuX: e.clientX,
                                contextMenuY: e.clientY,
                                supplierTableContextMenuSelect: row
                            });
                        }}
                        sortBy="name"
                        asc={true}
                    />
                </div>
                {this.renderNewSupplier()}
                {this.renderSupplierDetails()}
                {this.renderTableContextMenu()}
            </div>
        );
    }

    renderNewSupplier = () => {
        if (!this.state.renderedNewSupplier) return;

        return (
            <SupplierNew
                appKey={this.props.appKey}
                onClose={() => {
                    this.setState({ renderedNewSupplier: false });
                }}
            />
        );
    };

    renderSupplierDetails = () => {
        let windows = [];
        for (let supplierId of this.state.renderedSupplierDetails) {
            windows.push(
                <SupplierDetail
                    key={supplierId._str}
                    appKey={this.props.appKey}
                    supplierId={supplierId}
                    onClose={() => {
                        let suppliers = this.state.renderedSupplierDetails;
                        suppliers.splice(suppliers.indexOf(supplierId), 1);
                        this.setState({ renderedSupplierDetails: suppliers });
                    }}
                />
            );
        }
        return windows;
    };

    openSupplier = id => {
        if (this.state.renderedSupplierDetails.includes(id)) {
            this.props.activateWindow(this.props.appKey, id._str);
        } else this.setState({ renderedSupplierDetails: [...this.state.renderedSupplierDetails, id] });
    };

    renderTableContextMenu = () => {
        let row = this.state.supplierTableContextMenuSelect;
        let supplierTableContextMenu = [
            {
                title: R.get("OPEN"),
                onClick: () => {
                    this.openSupplier(row._id);
                }
            }
        ];
        return (
            <Menu context={this} name="supplierTableContextMenu" x={this.state.contextMenuX} y={this.state.contextMenuY} content={supplierTableContextMenu} />
        );
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
)(Suppliers);

Suppliers.propTypes = {
    appKey: PropTypes.string.isRequired,
    db: PropTypes.object.isRequired,
    activateWindow: PropTypes.func.isRequired
};
