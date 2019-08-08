import _ from "lodash";
import uuidv4 from "uuid/v4";
import { Collection, oss } from "./resources";
import { Accounts } from "meteor/accounts-base";
import MailService from "./mail_service";
import Ajv from "ajv";

import EmployeeInitializationSchema from "../public/schemas/employee_initialization.schema.json";

const ajv = new Ajv();

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

export function getAuth(userId = this.userId) {
    let auth = {};

    // First merge the system auth
    let systemAuth = getSystemDefaultAuth();
    _.merge(auth, systemAuth);

    // If user is not loged in, or no employees are found, return the systemAuth
    if (!userId) return auth;
    let employeeInfo = Collection("employees").findOne({ email: getEmailById(userId) });
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

export function addUser(username, email) {
    if (!_.get(getAuth(this.userId), "user_admin", false)) {
        return {
            status: 401,
            reason: "Unauthorized"
        };
    }

    const tempPassword = uuidv4();

    Accounts.createUser({
        username,
        email,
        password: tempPassword
    });

    Collection("employees").insert({
        email: email,
        nickname: username,
        status: 0 // means initialized account
    });

    // Send password email to new user
    MailService.send(
        {
            to: email,
            subject: "Trumode OA 账户信息",
            text: `Hi ${username},\n\n欢迎来到 Trumode, 你的系统初始密码为：\n ${tempPassword}\n\n请使用本邮箱地址与此临时密码登陆系统并修改密码。注意，这不是你的电子邮箱密码，请加以区分。\n此邮件由系统发送，请勿回复。若有疑问请联系管理员。\n\nTrumode 技术中心`
        },
        (err, info) => {
            if (err) {
                return {
                    status: 500,
                    err,
                    info
                };
            } else {
                return {
                    status: 200,
                    info
                };
            }
        }
    );
}

export async function employee_register(data) {
    let email = getEmailById(this.userId);
    let employee = Collection("employees").findOne({ email });

    if (!employee) {
        return {
            status: 400,
            err: "Can't find this employee"
        };
    }

    if (employee.status !== 0) {
        return {
            status: 400,
            err: "This Employee's status is not 0"
        };
    }

    const valid = ajv.validate(EmployeeInitializationSchema, data);

    if (!valid) {
        return {
            status: 400,
            err: ajv.errorsText()
        };
    } else {
        Object.assign(employee, data);
        employee.status = 10;
        let err = null;
        await Collection("employees").update({ email }, employee, error => {
            err = error;
        });
        return {
            status: err ? 400 : 200,
            err
        };
    }
}
