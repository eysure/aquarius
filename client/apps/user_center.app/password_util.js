const pwdLen = /^.{8,}$/;
const pwdUpper = /^(?=.*[A-Z]).{0,}$/;
const pwdLower = /^(?=.*[a-z]).{0,}$/;
const pwdDigit = /^(?=.*[0-9]).{0,}$/;
const pwdSpecial = /^(?=.*[\\\~\`\!\@\#\$\%\^\&\*\(\)\+\=\_\-\{\}\[\]\|\:\;\"\'\?\/\<\>\,\.]).{0,}$/;
const pwdNothingElse = /[^\d\w\\\~\`\!\@\#\$\%\^\&\*\(\)\+\=\_\-\{\}\[\]\|\:\;\"\'\?\/\<\>\,\.]/;

export function passwordValidation(password) {
    let length = pwdLen.exec(password) ? true : false;
    let upperCase = pwdUpper.exec(password) ? 1 : 0;
    let lowerCase = pwdLower.exec(password) ? 1 : 0;
    let digit = pwdDigit.exec(password) ? 1 : 0;
    let special = pwdSpecial.exec(password) ? 1 : 0;
    let noForbidden = pwdNothingElse.exec(password) ? false : true;

    return length && upperCase + lowerCase + digit + special >= 2 && noForbidden;
}
