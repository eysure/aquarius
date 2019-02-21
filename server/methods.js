import _ from "lodash";
import uuidv4 from "uuid/v4";
import { Collection, oss } from "./resources";

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
        console.error("No system collection founded! Check the connection to MongoCollection database.");
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
export function testEmployeeExist() {
    if (!this.userId) return null;

    return Collection("employees").findOne(
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
}

export function uploadDesktop(fileInfo, fileData) {
    if (!this.userId) return null;

    let email = getEmailById(this.userId);
    let employee = Collection("employees").findOne({ email });
    if (!employee) return null;

    let prefix = "assets/user/desktop/";

    let oldDesktop = _.get(employee, "preferences.desktop");

    let relPath = uuidv4() + "." + fileInfo.name.split(".").pop();

    let client = oss();
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

    let email = getEmailById(this.userId);
    let employee = Collection("employees").findOne({ email });
    if (!employee) return null;

    let prefix = "assets/user/avatar/";

    let oldAvatar = employee.avatar;

    let relPath = uuidv4() + "." + fileInfo.name.split(".").pop();

    let client = oss();
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
