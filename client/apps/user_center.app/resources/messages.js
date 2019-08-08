export default {
    FILL_ALL_FIELDS: {
        title: ["Please fill in all fields", "请填写所有项目"],
        class: 3
    },
    NEW_PASSWORD_NOT_MATCH: {
        title: ["New password and repeat not match", "新密码与重复新密码不匹配"],
        class: 3
    },
    NEW_PASSWORD_NOT_VALID: {
        title: ["New password not valid", "新密码不符合规范"],
        content: ["Please check the password rules and try again", "请确认密码强度规则，并重试"],
        class: 3
    },
    CHANGE_PASSWORD_SUCCESSFUL: {
        title: ["Change password successfully", "更改密码成功"],
        class: 2
    },
    CHANGE_PASSWORD_FAILED: {
        title: ["Change password Failed", "更改密码失败"],
        content: "${error}",
        class: 5,
        persist: true
    },
    DEMO_CANT_CHANGE_PASSWORD: {
        title: ["Can't change password in demo", "演示模式不能更改密码"],
        content: ["Please keep the original password for others to use this demo.", "为了他人能够体验此系统，请保留原始密码不变"],
        class: 3,
        persist: true
    },
    EMPLOYEE_REGISTER_SUCCESSFUL: {
        title: ["Information uploaded", "信息已成功上传"],
        class: 2
    },
    EMPLOYEE_REGISTER_ERR: {
        title: ["Register Failed", "信息注册失败"],
        content: "${error}",
        class: 5,
        persist: true
    }
};
