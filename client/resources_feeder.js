import sysStrings from "./resources/string";
import sysMessages from "./resources/messages";
import _ from "lodash";

export class ResourceFeeder {
    strs = {};
    language = "en-US";

    constructor(...strs) {
        this.language = localStorage.getItem("language") || window.navigator.language;
        this.addStrings(sysStrings);
        this.addStrings(sysMessages);
        for (let str of strs) {
            this.addStrings(str);
        }
    }

    addStrings(strs) {
        if (!strs) return;
        let tmpStrings = {};
        let lan = strs["$LANGUAGE"];
        if (!lan) {
            console.error("strs doesn't include a $LANGUAGE field. can't be added into this resource feeder", strs);
            return;
        }
        if (_.isArray(lan)) {
            // Multiple Languages
            for (let key in strs) {
                tmpStrings[key] = {};
                if (!_.isArray(strs[key]) || strs[key].length !== lan.length) {
                    console.error(
                        `Resource translation value can only be array with the same length to $LANGUAGE. But got: `,
                        strs[key],
                        `\nLanguage are [${lan.join(" / ")}]. This key will not add.`
                    );
                    continue;
                }
                for (let i in strs[key]) {
                    lan[i].split(",").forEach(l => {
                        let lt = l.trim();
                        tmpStrings[key][lt] = strs[key][i];
                    });
                }
            }
        } else {
            // Single Languages
            for (let key in strs) {
                tmpStrings[key] = {};
                lan.split(",").forEach(l => {
                    let lt = l.trim();
                    tmpStrings[key][lt] = strs[key];
                });
            }
        }

        // assign
        for (let key in tmpStrings) {
            this.strs[key] = { ...this.strs[key], ...tmpStrings[key] };
        }
    }

    get(key, args = null) {
        if (!this.strs[key] || Object.keys(this.strs[key]).length === 0) {
            console.warn(`The key "${key}" can't be find inside this resource feeder. Return the key itself instead.`);
            return key;
        }
        let res = this.strs[key][this.language];
        if (!res) {
            console.warn(`The key "${key}" can't find a supported string in this resource feeder. Return default language "${Object.keys(this.strs[key])[0]}"`);
            return this.strs[key][Object.keys(this.strs[key])[0]];
        }
        if (_.isFunction(res)) return res(args);
        return res;
    }

    Str(key, args = null) {
        console.warn("R.Str is deprecated, condier using R.get instead");
        return this.get(key, args);
    }

    Msg(key, args = null) {
        console.warn("R.get is deprecated, consider using R.get instead");
        return this.get(key, args);
    }

    trans(obj, args = null) {
        let res = obj[this.language];
        if (_.isFunction(res)) return res(args);
        return res;
    }
}

export const R = new ResourceFeeder();
