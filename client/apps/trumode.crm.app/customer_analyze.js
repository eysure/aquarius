import React, { Component } from "react";
import * as AQUI from "../../components/Window/core";
import { R } from "./index";
import _ from "lodash";

import Window from "../../components/Window";

export const TAB_CUSTOMER_BASIC_INFO = "TAB_CUSTOMER_BASIC_INFO";
export const TAB_CUSTOMER_CONTACTS = "TAB_CUSTOMER_CONTACTS";
export const TAB_CUSTOMER_ANALYZE = "TAB_CUSTOMER_ANALYZE";

import CustomerBasicInfo from "./customer_basic_info";
import CustomerContacts from "./customer_contacts";

import { Collection } from "../../utils";

class CustomerAnalyze extends Component {
    render() {
        return <div className="empty-page">Customer Analyze</div>;
    }
}

export default CustomerAnalyze;
