import { Meteor } from "meteor/meteor";
import clientConfig from "./client_config";
import { Mongo } from "meteor/mongo";
import MESSAGES from "./resources/messages";
import { R } from "./resources_feeder";
import _ from "lodash";
import Countries from "./resources/countries";

export function generateEmailLink(receiver, subject, body) {
    return `mailto:${receiver}?subject=${clientConfig.mailPrefix} ${subject}&body=${body}`;
}

export function generateEmailLinkToService(subject, body) {
    return `mailto:${clientConfig.serviceEmail}?subject=${clientConfig.mailPrefix} ${subject}&body=${body}`;
}

export function generateEmailLinkToTech(subject, body) {
    return `mailto:${clientConfig.techSupportEmail}?subject=${clientConfig.mailPrefix} ${subject}&body=${body}`;
}

export function getMsg(msgKey, args) {
    let msg = Object.assign({}, MESSAGES[msgKey]);
    if (!msg) {
        console.error("Message fatch failed. Key: " + msgKey);
        return {
            title: ["New Message", "新消息"],
            content: msgKey,
            class: 3
        };
    }
    if (args) {
        msg = JSON.stringify(msg);
        msg = replaceAll(msg, args);
        msg = JSON.parse(msg);
    }
    return msg;
}

function replaceAll(str, vals) {
    if (!vals) return str;
    if (vals instanceof Object) {
        let newStr = str.slice(0);
        for (let key in vals) {
            let result = newStr.replace(new RegExp("\\$\\{" + key + "\\}", "g"), vals[key]);
            if (result === newStr) {
                console.warn(`Uncatch value: ${key}: ${vals[key]}`);
                break;
            } else newStr = result;
        }
        return newStr;
    } else {
        console.error("Uncapable type of arguments.");
        console.error(args);
        return str;
    }
}

// TODO: THESE FUNCTIIONS ARE NOT IN THE STANDARD BUNDLE, AND NEED TO MOVE!!!

export function Collection(string) {
    return Meteor.connection._mongo_livedata_collections[string] || new Mongo.Collection(string);
}

export function oss(...paths) {
    let { ossBucket, ossRegion } = clientConfig;
    return [`https://${ossBucket}.${ossRegion}.aliyuncs.com`, ...paths].join("/");
}

export function fileUploadVerify(file, throwMsg = null) {
    let ext = file.name.split(".").pop();
    if (!clientConfig.acceptableFileFormat.includes(ext)) {
        if (throwMsg) {
            throwMsg(
                R.Msg("FILE_UPLOAD_FAILED_FORMAT", {
                    ext,
                    acceptableFileFormat: clientConfig.acceptableFileFormat.join(", ")
                })
            );
        }
        return {
            result: false,
            error: "FILE_UPLOAD_FAILED_FORMAT"
        };
    }
    if (file.size > clientConfig.maxFileSize * 1024 * 1024) {
        if (throwMsg) {
            throwMsg(
                R.Msg("FILE_UPLOAD_FAILED_SIZE", {
                    fileSize: (file.size / 1048576).toFixed(2),
                    maxFileSize: clientConfig.maxFileSize
                })
            );
        }
        return {
            result: false,
            error: "FILE_UPLOAD_FAILED_SIZE"
        };
    }
    return {
        result: true
    };
}

export function upload(file, args = null, beforeUpload, callback) {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = e => {
        beforeUpload();
        Meteor.call(
            "upload",
            {
                ...args,
                name: file.name,
                size: file.size
            },
            reader.result,
            callback
        );
    };
}

export function animate(item, callback, ...animationClass) {
    if (!item) {
        console.error("Item is not exist");
        return;
    }
    let eventListener = () => {
        item.classList.remove(...animationClass);
        if (callback) callback();
        item.removeEventListener("animationend", eventListener);
    };
    item.addEventListener("animationend", eventListener);
    item.classList.add(...animationClass);
}

export function computeJobInfo(user_id, db) {
    let res = [];

    // Compute the Job assignment info
    // let assignKey = _.findKey(db.employees_assign, { user_id });
    for (let assign of db.employees_assign) {
        if (assign.user_id === user_id && !assign.time_end) {
            // Get the group info
            let { group_id, job_title_id, job_type, time_start } = assign;
            let groupKey = _.findKey(db.depts_groups, { _id: group_id });
            if (!groupKey) return res;
            let group = db.depts_groups[groupKey];

            // Get the department info
            let deptKey = _.findKey(db.depts, { _id: group.dept_id });
            if (!deptKey) return res;
            let dept = db.depts[deptKey];

            // Get the job info
            let jobTitleKey = _.findKey(db.job_title, { _id: job_title_id });
            if (!jobTitleKey) return res;
            let jobTitle = db.job_title[jobTitleKey];

            res.push({
                groupName: R.Trans(group.name),
                deptName: R.Trans(dept.name),
                jobTitle: R.Trans(jobTitle.name),
                jobType: job_type,
                startTime: new Date(time_start)
            });
        }
    }
    return res;
}

export function checkAuth(auth, operation = null, context) {
    if (!_.get(context.props.auth, auth)) {
        context.props.throwMsg(
            R.Msg("OPD", {
                auth,
                operation: operation || ""
            })
        );
        return false;
    }
    return true;
}

export function getCountryList() {
    let list = {};
    for (let code in Countries) {
        list[code] = R.Str(code);
    }
    return list;
}
