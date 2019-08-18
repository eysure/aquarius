import * as ACTION from "../actions";
import { Meteor } from "meteor/meteor";

const defaultState = {
    menuBarHide: Meteor.userId() ? false : true,
    dockHide: Meteor.userId() ? false : true,
    blurScreen: Meteor.userId() ? 0 : 30,
    launchpadStatus: false,
    cardinalOpen: false
};

export default function(state = { ...defaultState }, action) {
    switch (action.type) {
        case ACTION.BIND_USER_INFO: {
            return {
                ...state,
                loginFlag: true,
                menuBarHide: false,
                dockHide: false,
                blurScreen: 0
            };
        }
        case ACTION.LOGOUT: {
            return {
                ...state,
                loginFlag: false,
                menuBarHide: true,
                dockHide: true,
                blurScreen: 30
            };
        }
        case ACTION.SYSTEM_CONTROL: {
            return { ...state, ...action.payload.system };
        }
        case ACTION.LAUNCHPAD_CONTROL: {
            return {
                ...state,
                launchpadStatus: action.payload.data.launchpadStatus
            };
        }
        default:
            return state;
    }
}
