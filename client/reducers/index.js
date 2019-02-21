// rootReducer: contain several sub-reducers to comsume response of server

import { combineReducers } from "redux";

import NotificationsReducer from "./reducer_notifications";
import SystemReducer from "./reducer_system";
import UserReducer from "./reducer_user";
import CompanyReducer from "./reducer_company";
import DebugReducer from "./reducer_debug";
import AppsReducer from "./reducer_apps";
import CollectionsReducer from "./reducer_collections";

const rootReducer = combineReducers({
    apps: AppsReducer,
    company: CompanyReducer,
    debug: DebugReducer,
    notifications: NotificationsReducer,
    system: SystemReducer,
    user: UserReducer,
    db: CollectionsReducer
});

export default rootReducer;
