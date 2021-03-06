import _ from "lodash";
import uuidv4 from "uuid/v4";
import { Collection, oss } from "./resources";
import { Accounts } from "meteor/accounts-base";
import MailService from "./mail_service";
import Ajv from "ajv";
import { Mongo } from "meteor/mongo";

import EmployeeInitializationSchema from "../public/schemas/employee_initialization.schema.json";

const ajv = new Ajv();

getEmailById = userId => {
    let user = Meteor.users.findOne({ _id: userId });
    if (!user) return null;
    return user.emails[0].address;
};
getEmployeeByUserId = userId => {
    if (!userId) return null;
    return Collection("employees").findOne({ email: getEmailById(userId) });
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
    if (!this.userId) throw new Meteor.Error(401, "User is not loged in");
    if (!_.get(getAuth(this.userId), "user_admin", false)) {
        throw new Meteor.Error(403, "Authorization Failed");
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
                throw new Meteor.Error(500, err, info);
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
        throw new Meteor.Error(404, "Can't find the target employee.");
    }

    if (employee.status !== 0) {
        throw new Meteor.Error(404, "Target employee's status is not zero.");
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

export function upload(args, file) {
    if (!this.userId) throw new Meteor.Error(401, "User is not loged in");

    let client = oss();
    if (!client) return new Meteor.Error(500, "OSS cannot establish");

    let { db, findOne, field, name } = args;

    // Auth check
    if (!_.get(getAuth(this.userId), `wr_${db}`, false)) {
        throw new Meteor.Error(403, `wr_${db}`);
    }

    let target = Collection(db).findOne(findOne);
    if (!target) throw new Meteor.Error(404, "Target is not find");

    let prefix = `assets/${db}/${field}/`;

    let oldUri = _.get(target, field, null);
    let newUri = uuidv4() + "." + name.split(".").pop();

    let employeeId = getEmployeeByUserId(this.userId)._id;

    async function deleteFile() {
        try {
            await client.delete(oldUri);
        } catch (err) {
            throw new Meteor.Error(err);
        }
    }

    async function put() {
        try {
            await client.put(prefix + newUri, new Buffer(file, "binary"));
            let data = {
                [field]: prefix + newUri,
                time_modified: new Date(),
                employee_modified: employeeId
            };
            Collection(db).update(findOne, { $set: data });
            if (oldUri) deleteFile();
            return {
                status: 200,
                uri: newUri
            };
        } catch (err) {
            throw new Meteor.Error(500, err);
        }
    }

    return put();
}

export async function edit(args) {
    if (!this.userId) throw new Meteor.Error(401, "User is not loged in");

    let client = oss();
    if (!client) throw new Meteor.Error(500, "OSS cannot establish");

    let { db, findOne, action, data } = args;
    if (!db) throw new Meteor.Error(400, "Database is not set");

    // Auth check
    if (!_.get(getAuth(this.userId), `wr_${db}`, false)) {
        throw new Meteor.Error(403, `wr_${db}`);
    }

    // TODO: Schema Validation

    let employeeId = getEmployeeByUserId(this.userId)._id;

    try {
        if (action === "insert" || action === "add") {
            if (!data._id) data._id = new Mongo.ObjectID();
            data.time_created = new Date();
            data.time_modified = new Date();
            data.employee_created = employeeId;
            data.employee_modified = employeeId;
            Collection(db).insert(data);
        } else if (action === "update" || action === "edit") {
            data.time_modified = new Date();
            data.employee_modified = employeeId;
            Collection(db).update(findOne, { $set: data });
        } else if (action === "delete" || action === "remove") {
            Collection(db).remove(findOne);
        }
    } catch (err) {
        throw new Meteor.Error(500, err);
    }

    return {
        status: 200
    };
}

export async function editCustomer(data) {
    if (!this.userId) throw new Meteor.Error(401, "User is not loged in");

    let client = oss();
    if (!client) return new Meteor.Error(500, "OSS cannot establish");

    // Auth check
    if (!_.get(getAuth(this.userId), `wr_customers`, false)) {
        throw new Meteor.Error(403, `wr_customers`);
    }

    let customer = Collection("customers").findOne({ _id: data._id });
    if (!customer) throw new Meteor.Error(404, "Customer not found");

    data.time_modified = new Date();

    try {
        Collection("customers").update({ _id: data._id }, { $set: data });
    } catch (err) {
        throw new Meteor.Error(500, err);
    }

    return {
        status: 200
    };
}

export function deleteCustomer(id) {
    if (!this.userId) throw new Meteor.Error(401, "User is not loged in");

    // Auth check
    if (!_.get(getAuth(this.userId), `wr_customers`, false)) {
        throw new Meteor.Error(403, `wr_customers`);
    }

    let customer = Collection("customers").findOne({ _id: id });
    if (!customer) throw new Meteor.Error(404, "Customer not found");

    // TODO: Check if any order has this customer, if so, delete is forbidden

    try {
        Collection("customers").remove({ _id: id });
    } catch (err) {
        throw new Meteor.Error(500, err);
    }

    return {
        status: 200
    };
}

export function addCustomer(data) {
    if (!this.userId) throw new Meteor.Error(401, "User is not loged in");

    // Auth check
    if (!_.get(getAuth(this.userId), `wr_customers`, false)) {
        throw new Meteor.Error(403, `wr_customers`);
    }

    data.time_created = new Date();
    data.time_modified = new Date();

    try {
        Collection("customers").insert(data);
    } catch (err) {
        throw new Meteor.Error(500, err);
    }

    return {
        status: 200
    };
}
