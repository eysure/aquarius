// System Apps
import AboutSystem from "./apps/about_system.app";
import Admin from "./apps/admin";
import AppManager from "./apps/app_manager";
import Debugger from "./apps/debugger";
import Preference from "./apps/preference.app";
import Search from "./apps/search";
import UserCenter from "./apps/user_center.app";
import Manual from "./apps/manual.app";
import Welcome from "./apps/welcome.app";

// 3rd Apps
import OrderManager from "./apps/trumode.order_manager.app";
import Contacts from "./apps/trumode.contacts.app";
import CustomerRelationshipManager from "./apps/trumode.crm.app";
import ProductManager from "./apps/trumode.product_manager.app";

const INSTALLED_APPS = [
    AboutSystem,
    Admin,
    AppManager,
    Debugger,
    Contacts,
    Preference,
    Search,
    UserCenter,
    Manual,
    Welcome,
    OrderManager,
    CustomerRelationshipManager,
    ProductManager
];

let installedAppsMap = {};
INSTALLED_APPS.map(APP => {
    let appKey = APP.manifest.appKey;
    installedAppsMap[appKey] = APP;
});

export default installedAppsMap;
