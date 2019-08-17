import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UI from "@material-ui/core";
import Str from "../../components/string_component";
import ItemTableRow from "./item_table_row";
import _ from "lodash";

import { R } from "./index";

import { deleteSalesOrder, updateSalesOrder } from "../../actions";

const blankContainerStyle = {
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "lightgrey"
};

const blankContainerIconStyle = {
    fontSize: "8em"
};

const toolbarButtonStyle = {
    width: "36px",
    height: "36px",
    padding: "0",
    minWidth: "0",
    marginRight: "8px"
};

const itemImageCellStyle = {
    width: "48px",
    paddingRight: "24px"
};

const tableCellStyle = {
    padding: "0 12px 0 12px"
};

class OrderDetail extends Component {
    state = {
        orderDetail: this.props.orderDetail,
        editMode: false,
        deleteConfirmOpen: false,
        deleteConfirmAnchor: null,
        deleteConfirmOrderID: "",
        deleteConfirmOrderIDError: false
    };

    gettitleBarStyle = () => {
        return {
            position: "fixed",
            width: this.props.width,
            borderBottom: this.state.editMode ? "1px solid #81C0FC" : "1px solid lightgrey",
            padding: "8px 0",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: this.state.editMode ? "#E4F0FA" : "#F5F4F6",
            zIndex: "1000"
        };
    };

    renderBlankPage() {
        return (
            <div style={blankContainerStyle}>
                <UI.Icon style={blankContainerIconStyle}>{R.get("SALES_ORDER_ICON")}</UI.Icon>
            </div>
        );
    }

    handleChange = (e, uppercase) => {
        this.setState({
            orderDetail: {
                ...this.state.orderDetail,
                [e.target.name]: uppercase ? e.target.value.toUpperCase() : e.target.value
            }
        });
        e.preventDefault();
    };

    handleDeleteConfirmOrderIDChange = e => {
        this.setState({
            deleteConfirmOrderID: e.target.value,
            deleteConfirmOrderIDError: false
        });
    };

    renderDeleteConfirmDialog() {
        return (
            <div style={{ padding: "16px" }}>
                <UI.Typography variant="title" gutterBottom>
                    {R.get("CONFIRM_DELETE_TITLE")}
                </UI.Typography>
                <UI.Typography variant="body1">{R.get("CONFIRM_DELETE_TIP")}</UI.Typography>
                <UI.TextField
                    variant="outlined"
                    name="deleteConfirmOrderID"
                    label={R.get("ORDER_ID")}
                    value={this.state.deleteConfirmOrderID}
                    onChange={this.handleDeleteConfirmOrderIDChange}
                    margin="normal"
                    fullWidth
                    error={this.state.deleteConfirmOrderIDError}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <UI.Button onClick={this.handleDeleteCancel}>{R.get("CANCEL")}</UI.Button>
                    <UI.Button color="secondary" onClick={this.handleDeleteConfirm}>
                        {R.get("DELETE")}
                    </UI.Button>
                </div>
            </div>
        );
    }

    handleDeleteConfirm = e => {
        if (this.props.orderDetail.order_id === this.state.deleteConfirmOrderID) {
            this.props.deleteSalesOrder(this.props.orderDetail.order_id);
            this.setState({ orderDetail: null });
        } else {
            this.setState({ deleteConfirmOrderIDError: true });
        }
    };

    handleEditModeOn = e => {
        this.setState({ editMode: true });
    };

    handleDelete = e => {
        this.setState({
            deleteConfirmOpen: true,
            deleteConfirmAnchor: e.currentTarget
        });
    };

    handleDeleteCancel = e => {
        this.setState({
            deleteConfirmAnchor: null,
            deleteConfirmOpen: false
        });
    };

    // Cancel the edit, revert the detail to the original version (data in the props)
    handleCancel = () => {
        this.setState({
            editMode: false,
            orderDetail: this.props.orderDetail
        });
    };

    handleSave = () => {
        this.props.updateSalesOrder(this.props.orderDetail.order_id, this.state.orderDetail);
        this.setState({ editMode: false });
    };

    handlePrint = () => {
        console.log("print");
    };

    handleBookMark = () => {
        console.log("bookmark");
    };

    renderToolBarEditButton() {
        return (
            <div>
                <UI.Tooltip title={R.get("DELETE")} enterDelay={200}>
                    <UI.Button color="secondary" aria-label="Delete" style={toolbarButtonStyle} onClick={this.handleDelete}>
                        <i className="material-icons">delete</i>
                    </UI.Button>
                </UI.Tooltip>
                <UI.Popover
                    id="delete-confirm-popover"
                    open={this.state.deleteConfirmOpen}
                    onClose={this.handleDeleteCancel}
                    anchorEl={this.state.deleteConfirmAnchor}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                    elevation={12}
                >
                    {this.renderDeleteConfirmDialog()}
                </UI.Popover>
                <UI.Tooltip title={R.get("CANCEL")} enterDelay={200}>
                    <UI.Button aria-label="Cancel" style={toolbarButtonStyle} onClick={this.handleCancel}>
                        <i className="material-icons">clear</i>
                    </UI.Button>
                </UI.Tooltip>
                <UI.Tooltip title={R.get("SAVE")} enterDelay={200}>
                    <UI.Button aria-label="Save" style={toolbarButtonStyle} onClick={this.handleSave}>
                        <i className="material-icons">save</i>
                    </UI.Button>
                </UI.Tooltip>
            </div>
        );
    }

    renderToolBarNonEditButton() {
        return (
            <div>
                <UI.Tooltip title={R.get("BOOKMARK")} enterDelay={200}>
                    <UI.Button aria-label="Bookmark" style={toolbarButtonStyle} onClick={this.handleBookMark}>
                        <i className="material-icons">star_border</i>
                    </UI.Button>
                </UI.Tooltip>
                <UI.Tooltip title={R.get("PRINT")} enterDelay={200}>
                    <UI.Button aria-label="Print" style={toolbarButtonStyle} onClick={this.handlePrint}>
                        <i className="material-icons">print</i>
                    </UI.Button>
                </UI.Tooltip>
                <UI.Tooltip title={R.get("EDIT")} enterDelay={200}>
                    <UI.Button aria-label="Edit" style={toolbarButtonStyle} onClick={this.handleEditModeOn}>
                        <i className="material-icons">edit</i>
                    </UI.Button>
                </UI.Tooltip>
            </div>
        );
    }

    renderToolBar() {
        return <div style={this.gettitleBarStyle()}>{this.state.editMode ? this.renderToolBarEditButton() : this.renderToolBarNonEditButton()}</div>;
    }

    renderOrderDetail() {
        return (
            <UI.Grid container spacing={24}>
                <UI.Grid item xs={12}>
                    <UI.Typography variant="caption" gutterBottom>
                        {R.get("BASIC_INFO")}
                    </UI.Typography>
                    <UI.Paper className="order-detail-paper">
                        <UI.Grid container spacing={24}>
                            <UI.Grid item xs={6}>
                                <UI.TextField
                                    name="order_id"
                                    className="order-detail-input"
                                    label={R.get("ORDER_ID")}
                                    value={this.state.orderDetail.order_id}
                                    margin="normal"
                                    fullWidth
                                    disabled={!this.state.editMode}
                                    onChange={this.handleChange}
                                />
                            </UI.Grid>

                            <UI.Grid item xs={6}>
                                <UI.TextField
                                    select
                                    name="order_status"
                                    className="order-detail-input"
                                    label={R.get("ORDER_STATUS")}
                                    value={this.state.orderDetail.order_status}
                                    margin="normal"
                                    fullWidth
                                    disabled={!this.state.editMode}
                                    onChange={this.handleChange}
                                >
                                    <UI.MenuItem key="ORDER_STATUS_DRAFT" value="ORDER_STATUS_DRAFT">
                                        {R.get("ORDER_STATUS_DRAFT")}
                                    </UI.MenuItem>
                                    <UI.MenuItem key="ORDER_STATUS_ESTABLISHED" value="ORDER_STATUS_ESTABLISHED">
                                        {R.get("ORDER_STATUS_ESTABLISHED")}
                                    </UI.MenuItem>
                                    <UI.MenuItem key="ORDER_STATUS_IN_PRODUCTION" value="ORDER_STATUS_IN_PRODUCTION">
                                        {R.get("ORDER_STATUS_IN_PRODUCTION")}
                                    </UI.MenuItem>
                                    <UI.MenuItem key="ORDER_STATUS_SHIPPED" value="ORDER_STATUS_SHIPPED">
                                        {R.get("ORDER_STATUS_SHIPPED")}
                                    </UI.MenuItem>
                                    <UI.MenuItem key="ORDER_STATUS_ARREARS" value="ORDER_STATUS_ARREARS">
                                        {R.get("ORDER_STATUS_ARREARS")}
                                    </UI.MenuItem>
                                    <UI.MenuItem key="ORDER_STATUS_FINISHED" value="ORDER_STATUS_FINISHED">
                                        {R.get("ORDER_STATUS_FINISHED")}
                                    </UI.MenuItem>
                                    <UI.MenuItem key="ORDER_STATUS_ABNORMAL" value="ORDER_STATUS_ABNORMAL">
                                        {R.get("ORDER_STATUS_ABNORMAL")}
                                    </UI.MenuItem>
                                </UI.TextField>
                            </UI.Grid>

                            <UI.Grid item xs={6}>
                                <UI.TextField
                                    name="create_date"
                                    className="order-detail-input"
                                    label={R.get("CREATE_DATE")}
                                    type="date"
                                    fullWidth
                                    value={this.state.orderDetail.create_date}
                                    margin="normal"
                                    disabled={!this.state.editMode}
                                    onChange={this.handleChange}
                                />
                            </UI.Grid>

                            <UI.Grid item xs={6}>
                                <UI.TextField
                                    name="sales"
                                    className="order-detail-input"
                                    label={R.get("SALES")}
                                    value={this.state.orderDetail.sales}
                                    margin="normal"
                                    fullWidth
                                    disabled={!this.state.editMode}
                                    onChange={this.handleChange}
                                />
                            </UI.Grid>

                            <UI.Grid item xs={12}>
                                <UI.TextField
                                    name="customer"
                                    className="order-detail-input"
                                    label={R.get("CUSTOMER")}
                                    value={this.state.orderDetail.customer}
                                    margin="normal"
                                    fullWidth
                                    disabled={!this.state.editMode}
                                    onChange={this.handleChange}
                                />
                            </UI.Grid>
                        </UI.Grid>
                    </UI.Paper>
                </UI.Grid>

                <UI.Grid item xs={12}>
                    <UI.Typography variant="caption" gutterBottom>
                        {R.get("COMMODITIES_DETAIL")}
                    </UI.Typography>
                    {this.renderOrderItemList()}
                </UI.Grid>

                <UI.Grid item xs={12}>
                    <UI.Typography variant="caption" gutterBottom>
                        {R.get("PAYMENT_DETAIL")}
                    </UI.Typography>
                    <UI.Paper className="order-detail-paper">{R.get("PAYMENT_DETAIL")}</UI.Paper>
                </UI.Grid>

                <UI.Grid item xs={12}>
                    <UI.Typography variant="caption" gutterBottom>
                        {R.get("SHIPPING_DETAIL")}
                    </UI.Typography>
                    <UI.Paper className="order-detail-paper">{R.get("SHIPPING_DETAIL")}</UI.Paper>
                </UI.Grid>
            </UI.Grid>
        );
    }

    renderOrderItemList() {
        return (
            <UI.Paper style={{ overflowX: "auto" }}>
                <UI.Table>
                    <UI.TableHead>
                        <UI.TableRow>
                            {this.state.editMode ? (
                                <UI.TableCell className="order-detail-item-button-cell">
                                    <UI.IconButton color="primary" onClick={this.addItem}>
                                        <i className="material-icons">add_circle</i>
                                    </UI.IconButton>
                                </UI.TableCell>
                            ) : null}
                            <UI.TableCell style={itemImageCellStyle}>{R.get("IMAGE")}</UI.TableCell>
                            <UI.TableCell style={tableCellStyle}>
                                <p style={{ fontWeight: 800 }}>{R.get("ITEM_NO")}</p>
                                <p>{R.get("PO_NO")}</p>
                            </UI.TableCell>
                            <UI.TableCell style={tableCellStyle}>
                                <p style={{ fontWeight: 800 }}>{R.get("ITEM_NAME")}</p>
                                <p>{R.get("ITEM_DESC")}</p>
                            </UI.TableCell>
                            <UI.TableCell align="right" style={tableCellStyle}>
                                {R.get("QTY")}
                            </UI.TableCell>
                            <UI.TableCell align="right" style={tableCellStyle}>
                                {R.get("PRICE")}
                            </UI.TableCell>
                            <UI.TableCell align="right" style={tableCellStyle}>
                                {R.get("AMOUNT")}
                            </UI.TableCell>
                            <UI.TableCell align="right" style={tableCellStyle}>
                                {R.get("DELIVERY_DATE")}
                            </UI.TableCell>
                            <UI.TableCell align="right" style={tableCellStyle}>
                                <p style={{ fontWeight: 800 }}>{R.get("PURCHASE_ORDER")}</p>
                                <p>{R.get("SUPPLIER")}</p>
                            </UI.TableCell>
                        </UI.TableRow>
                    </UI.TableHead>
                    <UI.TableBody>
                        {this.state.orderDetail.items.map(item => (
                            <ItemTableRow
                                key={item.item_no}
                                item={item}
                                editMode={this.state.editMode}
                                deleteItem={this.deleteItem}
                                onChange={this.handleItemChange}
                            />
                        ))}
                    </UI.TableBody>
                </UI.Table>
            </UI.Paper>
        );
    }

    addItem() {
        console.log("add item");
    }

    deleteItem = key => {
        let items = _.map(this.state.orderDetail.items, _.clone);
        _.remove(items, item => {
            return item.item_no === key;
        });
        this.setState({
            orderDetail: {
                ...this.state.orderDetail,
                items
            }
        });
    };

    handleItemChange = (item_no, prop, val, validationType) => {
        let items = _.map(this.state.orderDetail.items, _.clone);
        let itemIndex = _.findIndex(items, item => {
            return item.item_no === item_no;
        });

        if (itemIndex === -1) return;

        // Simple validation
        switch (validationType) {
            case "integer":
                if (val === "") val = 0;
                val = parseInt(val);
                if (isNaN(val)) return;
                break;
            case "float": {
                if (val === "") val = 0;
                else if (!val.endsWith(".")) val = parseFloat(val);
                if (isNaN(val)) return;
                break;
            }
            default:
                break;
        }

        items[itemIndex] = {
            ...items[itemIndex],
            [prop]: val
        };

        this.setState({
            orderDetail: {
                ...this.state.orderDetail,
                items
            }
        });
    };

    render() {
        if (_.get(this.state, "orderDetail.order_id", null) === null) return this.renderBlankPage();

        return (
            <div className="order-detail-container">
                {this.renderToolBar()}
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "auto",
                        padding: "32px",
                        paddingTop: "81px"
                    }}
                >
                    <UI.Grid container spacing={16}>
                        {this.renderOrderDetail()}
                    </UI.Grid>
                </div>
            </div>
        );
    }
}

// For test and demo use
OrderDetail.defaultProps = {
    orderDetail: {
        order_id: "TRU20XX-0000",
        order_status: "ORDER_STATUS_FINISHED",
        customer: "LTB",
        create_date: "2019-01-17",
        sales: "Henry",
        delivery_date: "2019-02-14",
        port_of_loading: "HZ",
        port_of_destination: "Dallas",
        currency: "RMB",
        amount: 28000,
        local_currency_amount: 28000,
        price_terms: "FOB SHANG HAI",
        payment: "30%预付款 70%交发票后1个月后付",
        credit_status: "赊账额度为:0,本合同金额已超出赊账额度.",
        credit_days: 20,
        quality_terms: "As per terms provided by Buyers.",
        remark: "Very good customer",
        ship_mark: "There is no shipmark",
        side_mark: "There is no sidemark",
        items: [
            {
                image: "sample1.jpg",
                item_no: "AB1879299",
                po_no: "B123",
                item_name: "Men's t-shirt",
                item_desc: "A men's beautiful t-shirt with many colors on it. Customers must like it.",
                qty: 3000,
                price: 3,
                currency: "USD",
                amount: 9000,
                delivery_date: "2019-01-01",
                purchase_order: "BB910482",
                supplier: "LiHuang"
            },
            {
                image: "sample2.jpg",
                item_no: "AB1879300",
                po_no: "B123",
                item_name: "Women's t-shirt",
                item_desc: "A women's beautiful t-shirt with many colors on it. Customers must like it.",
                qty: 2000,
                currency: "USD",
                price: 4,
                amount: 8000,
                delivery_date: "2019-01-01",
                purchase_order: "BB910482",
                supplier: "LiHuang"
            }
        ]
    }
};

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ deleteSalesOrder, updateSalesOrder }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderDetail);
