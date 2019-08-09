import sysStrings from "./resources/string";
import sysMessages from "./resources/messages";

export class ResourceFeeder {
    lanIndex = 0;
    sysLanIndex = 0;
    strings = null;
    messages = null;
    isFallbackToSystemResources = true;

    constructor(strs, msgs = null, isFallbackToSystemResources = true) {
        this.strings = strs ? strs.default : null;
        this.messages = msgs ? msgs.default : null;
        this.sysLanIndex = this.getLanguageIndex(sysStrings["LANGUAGES"]);
        this.lanIndex = strs ? this.getLanguageIndex(this.strings["LANGUAGES"]) : this.sysLanIndex;
        this.isFallbackToSystemResources = isFallbackToSystemResources;
    }

    Str = (strKey, args = null) => {
        if (!this.strings && !this.isFallbackToSystemResources) {
            console.error("No Strings given in this ResourceFeeder!");
            return null;
        }
        let str = null;
        if (this.strings) {
            str = this.strings[strKey];
            if (str) {
                str = str[this.lanIndex];
            }
        }
        if (!str && this.isFallbackToSystemResources) {
            str = sysStrings[strKey];
            if (str) {
                str = str[this.sysLanIndex];
            }
        }
        if (!str) {
            if (strKey instanceof Array) {
                str = strKey[this.sysLanIndex];
            }
        }
        if (!str) {
            console.error("String fetch failed. Key: " + strKey);
            return strKey;
        }
        if (args) {
            str = replaceAll(str, args);
        }
        return str;
    };

    Strs = strKeys => {
        let res = [];
        for (let strKey of strKeys) {
            res.push(this.Str(strKey));
        }
        return res;
    };

    Msg = (msgKey, args = null) => {
        if (!this.messages && !this.isFallbackToSystemResources) {
            console.error("No Messages given in this ResourceFeeder!");
            return null;
        }
        let msgTmp = null,
            msg = null;
        if (this.messages) {
            msgTmp = this.messages[msgKey];
            if (msgTmp) {
                msg = {};
                for (let key in msgTmp) {
                    if (msgTmp[key] instanceof Array) {
                        msg[key] = msgTmp[key][this.lanIndex];
                    } else msg[key] = msgTmp[key];
                }
            }
        }
        if (!msgTmp && this.isFallbackToSystemResources) {
            msgTmp = sysMessages[msgKey];
            if (msgTmp) {
                msg = {};
                for (let key in msgTmp) {
                    if (msgTmp[key] instanceof Array) {
                        msg[key] = msgTmp[key][this.sysLanIndex];
                    } else msg[key] = msgTmp[key];
                }
            }
        }
        if (!msg) {
            console.error("Message fetch failed. Key: " + msgKey);
            return {
                title: msgKey
            };
        }
        if (args) {
            for (let key in msg) {
                msg[key] = replaceAll(msg[key], args);
            }
        }
        return msg;
    };

    Trans = strArr => {
        if (strArr instanceof Array) {
            if (this.lanIndex >= strArr.length) {
                console.warn("Resource feeder translator: current language is not support for this string: ", strArr);
                return strArr[0];
            } else {
                return strArr[this.lanIndex];
            }
        } else {
            console.warn("Resource feeder translator accept a non array parameter");
            return strArr;
        }
    };

    getLanguageIndex = supportedLanguages => {
        let language = localStorage.getItem("language") || window.navigator.language;
        for (let i = 0; i < supportedLanguages.length; i++) {
            if (supportedLanguages[i] === language) {
                return i;
            }
        }
        console.warn(`Your language is not support in this app. Use default language: ${supportedLanguages[0]}`);
        return 0;
    };
}

function replaceAll(str, vals) {
    if (!str || !vals) return str;
    if (!(typeof str === "string" || str instanceof String)) return str;

    if (vals instanceof Object) {
        let newStr = str.slice(0);
        for (let key in vals) {
            let value = vals[key];
            if (!(typeof vals[key] === "string" || vals[key] instanceof String)) {
                value = JSON.stringify(vals[key]);
            }
            let result = newStr.replace(new RegExp("\\$\\{" + key + "\\}", "g"), value);
            newStr = result;
        }
        return newStr;
    } else {
        console.error("Uncapable type of arguments.");
        console.error(args);
        return str;
    }
}

// This is a global ResourceFeeder, don't have scope, use in the core system.
export const R = new ResourceFeeder();
