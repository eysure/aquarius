export default {
    FILL_ALL_FIELDS: {
        title: ["Please fill in all fields", "请填写所有项目"],
        class: 3
    },
    NEW_PASSWORD_NOT_MATCH: {
        title: ["New password and repeat not match", "新密码与重复新密码不匹配"],
        class: 3
    },
    CHANGE_PASSWORD_SUCCESSFUL: {
        title: ["Change password successfully", "更改密码成功"],
        content: ["You need to re-login using your new password", "你需要使用新密码重新登陆"],
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
    }
};
