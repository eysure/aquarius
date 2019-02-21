import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import clientConfig from "../client_config";

import STRINGS from "../resources/string";

class Str extends React.Component {
    render() {
        // lang: 0-en, 1-zh-CN
        let key = _.findLastKey(this.props, _.isBoolean) || "NULL";
        return getStr(key, this.props.user);
    }
}

export function getLanguage(userProps) {
    return _.get(
        userProps,
        "auth.language",
        Math.max(clientConfig.languages.indexOf(navigator.language), 0)
    );
}

export function getStr(key, userProps) {
    if (!STRINGS[key]) return key;
    return localize(STRINGS[key], userProps);
}

export function localize(strArr, userProps) {
    if (_.isUndefined(strArr)) {
        console.warn("Can't localize a undefined. return 'undefined' instead.");
        return undefined;
    }

    if (_.isNull(strArr)) {
        console.warn("Can't localize a null. return 'null' instead.");
        return null;
    }

    if (_.isNaN(strArr)) {
        console.warn("Can't localize a NaN. return 'NaN' instead.");
        return NaN;
    }

    if (_.isString(strArr) || _.isNumber(strArr)) return strArr; // If strArr is a string or number, return itself

    if (_.isArray(strArr)) {
        let lang = getLanguage(userProps);
        if (strArr.length < lang + 1) {
            console.warn(
                "User's language is not support yet. Use default instead."
            );
            return strArr[0];
        }
        return strArr[lang];
    }

    console.error("Can't localize this format. Give an array please." + strArr);
    return "";
}

export default connect(
    state => {
        return { user: state.user };
    },
    null
)(Str);
