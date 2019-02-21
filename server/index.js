import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import _ from "lodash";
import * as Methods from "./methods";
import { Collection } from "./resources";

Meteor.methods(Methods);

Accounts.onLogin(login => {
    if (login.type === "password") {
        Collection("login_log").insert({ ...login, timesteamp: new Date() });
    }
});

Accounts.onLoginFailure(login => {
    Collection("login_log_error").insert({ ...login, timesteamp: new Date() });
});

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
                mn_en: 1,
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
                mn_en: 1,
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

Meteor.publish("allEmployeesInfo", function() {
    if (!this.userId) return null;

    return [
        Collection("employees").find(
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
        ),
        Collection("employees_assign").find({ time_end: { $exists: false } }),
        Collection("depts").find(),
        Collection("depts_groups").find(),
        Collection("job_title").find()
    ];
});

getEmailById = userId => {
    let user = Meteor.users.findOne({ _id: userId });
    if (!user) return null;
    return user.emails[0].address;
};
