// import {config} from "dotenv";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";
import promise from "redux-promise";
import { Meteor } from "meteor/meteor";

// Initialize the system
import initialize from "./initialization";

// Components
import VirtualDataLayer from "./components/virtual_data_layer";
import Desktop from "./components/desktop";
import AppHost from "./components/app_host";
import MainFrame from "./components/main_frame";
import AccessControl from "./components/access_control";
import NotificationBar from "./components/notification_bar";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(promise)));

Meteor.startup(() => {
    initialize();
    ReactDOM.render(
        <Provider store={store}>
            <VirtualDataLayer />
            <Desktop />
            <AppHost />
            <MainFrame />
            <AccessControl />
            <NotificationBar />
            <div id="menu-container" className="first-class-overlap" />
        </Provider>,
        document.querySelector("#root")
    );
});
