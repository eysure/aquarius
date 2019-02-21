import { Meteor } from "meteor/meteor";
import clientConfig from "./client_config";
import { Mongo } from "meteor/mongo";
import MESSAGES from "./resources/messages";
import VDL from "./components/virtual_data_layer";

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

export function getLocalCollection(string) {
    return Meteor.connection._mongo_livedata_collections[string] || new Mongo.Collection(string);
}

export function oss(...paths) {
    let { ossBucket, ossRegion } = Meteor.settings.public;
    return [`https://${ossBucket}.${ossRegion}.aliyuncs.com`, ...paths].join("/");
}

export function fileUploadVerify(file, throwMsg = null, R = null) {
    let ext = file.name.split(".").pop();
    if (!Meteor.settings.public.acceptableFileFormat.includes(ext)) {
        if (throwMsg) {
            throwMsg(
                R.Msg("FILE_UPLOAD_FAILED_FORMAT", {
                    ext,
                    acceptableFileFormat: Meteor.settings.public.acceptableFileFormat.join(", ")
                })
            );
        }
        return {
            result: false,
            error: "FILE_UPLOAD_FAILED_FORMAT"
        };
    }
    if (file.size > Meteor.settings.public.maxFileSize * 1024 * 1024) {
        if (throwMsg) {
            throwMsg(
                R.Msg("FILE_UPLOAD_FAILED_SIZE", {
                    fileSize: (file.size / 1048576).toFixed(2),
                    maxFileSize: Meteor.settings.public.maxFileSize
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

export function upload(file, methodName, args = null, beforeUpload, callback) {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = e => {
        beforeUpload();
        Meteor.call(
            methodName,
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
