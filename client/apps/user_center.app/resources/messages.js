export default {
    $LANGUAGE: ["en,en-US", "zh,zh-CN"],
    FILL_ALL_FIELDS: [
        {
            title: "Please fill in all fields",
            class: 4
        },
        {
            title: "请填写所有项目",
            class: 4
        }
    ],
    NEW_PASSWORD_NOT_MATCH: [
        {
            title: "New password and repeat not match",
            class: 4
        },
        {
            title: "新密码与重复新密码不匹配",
            class: 4
        }
    ],
    NEW_PASSWORD_NOT_VALID: [
        {
            title: "New password not valid",
            content: "Please check the password rules and try again",
            class: 4
        },
        {
            title: "新密码不符合规范",
            content: "请确认密码强度规则，并重试",
            class: 4
        }
    ],
    CHANGE_PASSWORD_SUCCESSFUL: [
        {
            title: "Change password successfully",
            class: 2
        },
        {
            title: "更改密码成功",
            class: 2
        }
    ],
    CHANGE_PASSWORD_FAILED: [
        args => {
            return {
                title: "Change password Failed",
                class: 5,
                persist: true,
                raw: args.error
            };
        },
        args => {
            return {
                title: "更改密码失败",
                class: 5,
                persist: true,
                raw: args.error
            };
        }
    ],
    EMPLOYEE_REGISTER_SUCCESSFUL: [
        {
            title: "Information uploaded",
            class: 2
        },
        {
            title: "信息已成功上传",
            class: 2
        }
    ],
    EMPLOYEE_REGISTER_ERR: [
        args => {
            return {
                title: "Register Failed",
                class: 5,
                persist: true,
                raw: args.error
            };
        },
        args => {
            return {
                title: "信息注册失败",
                class: 5,
                persist: true,
                raw: args.error
            };
        }
    ],
    EMPLOYEE_STATUS_INVALID: [
        args => {
            return {
                title: "Employee Status Invalid",
                content: `Status: ${args.status}`,
                class: 5,
                persist: true
            };
        },
        args => {
            return {
                title: "员工状态码异常",
                content: `Status: ${args.status}`,
                class: 5,
                persist: true
            };
        }
    ]
};
