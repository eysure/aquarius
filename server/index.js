import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import * as Methods from "./methods";
import Publishing from "./publishing";
import { Collection, oss } from "./resources";
import Errors from "./errors";

async function listBuckets(client) {
    try {
        let result = await client.listBuckets();
        return result;
    } catch (err) {
        return err;
    }
}

/**
 * System Check
 */
systemCheck = () => {
    let myErrors = [];

    // Check users collection
    let userCount = Meteor.users.find().count();
    if (userCount === 0) {
        myErrors.push(Errors[1001]);
    }

    // Check oss
    let client = oss();
    if (!client) {
        myErrors.push(Errors[1002]);
    }

    listBuckets(client).then(res => {
        if (res.code) console.error("OSS Error: " + res.code);
    });

    return myErrors;
};

console.log("┌─────────────────────┐\n│   Server Started!   │\n└─────────────────────┘");
let myErrors = systemCheck();
if (myErrors.length !== 0) {
    console.error(`System initialization check has ${myErrors.length} error(s), server cannot start.`);
    console.error(`Check if you are using the Meteor Internal MongoDB, change to the outer MongoDB if possible.`);
    for (let i in myErrors) {
        console.error(myErrors[i].code + ":\t" + myErrors[i].reason);
    }
    process.exit(-1);
}

// Register methods
Meteor.methods(Methods);

// Publish
// for (let key in Publishing) {
//     Meteor.publish(key, Publishing[key]);
// }

Meteor.publish("fetchEmployeesInfo", function() {
    if (!this.userId) return null;

    return Collection("employees").find(
        { status: 1 },
        {
            fields: {
                _id: 1,
                nickname: 1,
                email: 1,
                name_cn: 1,
                fn_en: 1,
                ln_en: 1,
                mobile: 1,
                ext: 1,
                avatar: 1,
                preferences: 1
            }
        }
    );
});

Meteor.publish("myEmployeeInfo", function() {
    if (!this.userId) return null;

    return Collection("employees").find(
        { email: getEmailById(this.userId) },
        {
            fields: {
                _id: 1,
                nickname: 1,
                email: 1,
                name_cn: 1,
                fn_en: 1,
                ln_en: 1,
                mobile: 1,
                ext: 1,
                avatar: 1,
                preferences: 1,
                status: 1
            }
        }
    );
});

Meteor.publish("deptsInfo", function() {
    if (!this.userId) return null;
    return [Collection("depts").find()];
});

Meteor.publish("groupsInfo", function() {
    if (!this.userId) return null;
    return [Collection("depts_groups").find()];
});

Meteor.publish("allEmployeesBasicInfo", function() {
    if (!this.userId) return null;

    return Collection("employees").find(
        { hide: { $exists: false }, status: 1 },
        {
            fields: {
                _id: 1,
                nickname: 1,
                email: 1,
                name_cn: 1,
                fn_en: 1,
                ln_en: 1,
                mobile: 1,
                ext: 1,
                avatar: 1
            }
        }
    );
});

Meteor.publish("allEmployeesAssign", function() {
    if (!this.userId) return null;
    return Collection("employees_assign").find({ time_end: { $exists: false } });
});

Meteor.publish("jobTitleInfo", function() {
    if (!this.userId) return null;
    return Collection("job_title").find();
});

// Account log
Accounts.onLogin(login => {
    if (login.type === "password") {
        Collection("login_log").insert({ ...login, timesteamp: new Date() });
    }
});
Accounts.onLoginFailure(login => {
    Collection("login_log_error").insert({ ...login, timesteamp: new Date() });
});
