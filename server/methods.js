import _ from "lodash";
import uuidv4 from "uuid/v4";
import { Collection, oss } from "./resources";
import { Accounts } from "meteor/accounts-base";
import sys_errors from "./errors";

getEmailById = userId => {
    let user = Meteor.users.findOne({ _id: userId });
    if (!user) return null;
    return user.emails[0].address;
};

/**
 * Return the system collection default auth
 */
export function getSystemDefaultAuth() {
    let defaultAuth = Collection("system").findOne({ key: "defaultAuth" });
    if (!defaultAuth) {
        console.error("No system default auth founded! Check the connection to MongoCollection database.");
        return null;
    }
    return defaultAuth.value;
}

export function getClientOSSInfo() {
    return Collection("system").findOne({ key: "ossAuth" }, { fields: { _id: 0, region: 1, bucket: 1 } });
}

/**
 * Return the current user's employee info.
 */
// export function getMyEmployeeInfo() {
//     if (!this.userId) return null;

//     let employee = Collection("employees").findOne(
//         { email: getEmailById(this.userId) },
//         {
//             fields: {
//                 _id: 1,
//                 nickname: 1,
//                 email: 1,
//                 name_cn: 1,
//                 fn_en: 1,
//                 ln_en: 1,
//                 mobile: 1,
//                 ext: 1,
//                 avatar: 1,
//                 preferences: 1,
//                 status: 1
//             }
//         }
//     );

//     employee.auth = getAuth(true);

//     return employee;
// }

export function uploadDesktop(fileInfo, fileData) {
    if (!this.userId) return null;
    let client = oss();
    if (!client) return null;

    let email = getEmailById(this.userId);
    let employee = Collection("employees").findOne({ email });
    if (!employee) return null;

    let prefix = "assets/user/desktop/";

    let oldDesktop = _.get(employee, "preferences.desktop");

    let relPath = uuidv4() + "." + fileInfo.name.split(".").pop();

    let path = prefix + relPath;

    async function deleteFile() {
        try {
            await client.delete(prefix + oldDesktop);
        } catch (err) {
            throw new Meteor.Error(err);
        }
    }

    async function put() {
        try {
            await client.put(path, new Buffer(fileData, "binary"));
            Collection("employees").update({ email }, { $set: { preferences: { desktop: relPath } } });
            if (oldDesktop) {
                deleteFile();
            }
            return relPath;
        } catch (err) {
            throw new Meteor.Error(err);
        }
    }

    return put();
}

export function uploadAvatar(fileInfo, fileData) {
    if (!this.userId) return null;
    let client = oss();
    if (!client) return null;

    let email = getEmailById(this.userId);
    let employee = Collection("employees").findOne({ email });
    if (!employee) return null;

    let prefix = "assets/user/avatar/";

    let oldAvatar = employee.avatar;

    let relPath = uuidv4() + "." + fileInfo.name.split(".").pop();

    let path = prefix + relPath;

    async function deleteFile() {
        try {
            await client.delete(prefix + oldAvatar);
        } catch (err) {
            throw new Meteor.Error(err);
        }
    }

    async function put() {
        try {
            await client.put(path, new Buffer(fileData, "binary"));
            Collection("employees").update({ email }, { $set: { avatar: relPath } });
            if (oldAvatar) {
                deleteFile();
            }
            return relPath;
        } catch (err) {
            throw new Meteor.Error(err);
        }
    }

    return put();
}

// Add Merge rules:
// - If two auths are numbers, return the larger one
// - If two auths are arrays, concat them together
// - If two auths are boolean, return either one is true
// - If two auths are objects, futher merge them
function addMerge(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return [...new Set([...objValue, ...srcValue])];
    } else if (_.isNumber(objValue)) {
        return Math.max(objValue, srcValue);
    } else if (_.isBoolean(objValue)) {
        return objValue || srcValue;
    }
}

// Overwrite everything, except for the arrays
function overwrite(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return [...new Set([...objValue, ...srcValue])];
    }
}

export function getAuth() {
    let auth = {};

    // First merge the system auth
    let systemAuth = getSystemDefaultAuth();
    _.merge(auth, systemAuth);

    // If user is not loged in, or no employees are found, return the systemAuth
    if (!this.userId) return auth;
    let employeeInfo = Collection("employees").findOne({ email: getEmailById(this.userId) });
    if (!employeeInfo) return auth;

    let employeeId = employeeInfo._id;
    let employeeAssigns = Collection("employees_assign")
        .find({ user_id: employeeId, time_end: { $exists: false } })
        .fetch();

    let orgAuth = {};
    // For each role, overwrite the group auth to the dept auth, then add up all the role's auth
    for (let assign of employeeAssigns) {
        let group = Collection("depts_groups").findOne({ _id: assign.group_id });
        let groupAuth = group.auth || {};

        let dept = Collection("depts").findOne({ _id: group.dept_id });
        let deptAuth = dept.auth || {};

        _.mergeWith(deptAuth, groupAuth, overwrite);
        _.mergeWith(orgAuth, deptAuth, addMerge);
    }
    _.mergeWith(auth, orgAuth, overwrite);

    // Finally use employee auth to overwrite the auth
    let employeeAuth = employeeInfo.auth || {};
    _.mergeWith(auth, employeeAuth, overwrite);

    return auth;
}
