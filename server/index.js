import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import * as Methods from "./methods";
import { Collection, oss } from "./resources";
import Errors from "./errors";
import MailService from "./mail_service";

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

    // Check System Default Auth
    let systemDefaultAuth = Methods.getSystemDefaultAuth();
    if (systemDefaultAuth == null) {
        myErrors.push(Errors[1000]);
    }

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

    // Nodemailer
    let mailServer = Collection("system").findOne({ key: "mailServer" });
    let mailSender = Collection("system").findOne({ key: "mailSenderAccount" });
    if (mailServer == null) {
        myErrors.push(Errors[1003]);
    }
    if (mailSender == null) {
        myErrors.push(Errors[1004]);
    }
    MS = new MailService(mailServer, mailSender);

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

// User's connected employee's info
Meteor.publish("myEmployeeInfo", function() {
    if (!this.userId) return null;

    return Collection("employees").find(
        { email: getEmailById(this.userId) },
        {
            fields: {
                _id: 1,
                nickname: 1,
                email: 1,
                email2: 1,
                fname: 1,
                mname: 1,
                lname: 1,
                mobile: 1,
                mobile2: 1,
                ext: 1,
                avatar: 1,
                preferences: 1,
                status: 1,
                auth: 1,
                ethnic: 1,
                dob: 1
            }
        }
    );
});

// Departments info
Meteor.publish("deptsInfo", function() {
    if (!this.userId) return null;
    return [Collection("depts").find()];
});

// Department group info
Meteor.publish("groupsInfo", function() {
    if (!this.userId) return null;
    return [Collection("depts_groups").find()];
});

// Job title
Meteor.publish("jobTitleInfo", function() {
    if (!this.userId) return null;
    return Collection("job_title").find();
});

// Basic employees info for Contact use.
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

// Currently Assigned employee's job
Meteor.publish("allEmployeesAssign", function() {
    if (!this.userId) return null;
    return Collection("employees_assign").find({ time_end: { $exists: false } });
});

Meteor.publish("allCustomers", function() {
    if (!this.userId) return null;
    return Collection("customers").find();
});

Meteor.publish("customerContacts", function(args) {
    if (!this.userId) return null;
    return Collection("customers_contacts").find({ customer_id: args.customer_id });
});

Meteor.publish("allSuppliers", function() {
    if (!this.userId) return null;
    return Collection("suppliers").find();
});

Meteor.publish("supplierContacts", function(args) {
    if (!this.userId) return null;
    return Collection("suppliers_contacts").find({ supplier_id: args.supplier_id });
});

// Account log
Accounts.config({
    loginExpirationInDays: 1,
    forbidClientAccountCreation: true
});
Accounts.onLogin(login => {
    if (login.type === "password") {
        Collection("login_log").insert({ ...login, timesteamp: new Date() });
    }
});
Accounts.onLoginFailure(login => {
    Collection("login_log_error").insert({ ...login, timesteamp: new Date() });
});
