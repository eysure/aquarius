// rootReducer: contain several sub-reducers to comsume response of server

import { combineReducers } from "redux";

import NotificationsReducer from "./reducer_notifications";
import SystemReducer from "./reducer_system";
import UserReducer from "./reducer_user";
import CompanyReducer from "./reducer_company";
import DebugReducer from "./reducer_debug";
import ApplicationsReducer from "./reducer_apps";
import CollectionsReducer from "./reducer_collections";
import WindowsReducer from "./reducer_windows";

const rootReducer = combineReducers({
    apps: ApplicationsReducer,
    windows: WindowsReducer,
    company: CompanyReducer,
    debug: DebugReducer,
    notifications: NotificationsReducer,
    system: SystemReducer,
    user: UserReducer,
    db: CollectionsReducer
});

export default rootReducer;
