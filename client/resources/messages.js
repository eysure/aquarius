export default {
    DEMO_WELCOME: {
        title: ["Welcome to AquariusOS"],
        content: "This is a demo of AquariusOS, test account is provided. Please enjoy! And you are always welcome to drop a feedback.",
        class: 2,
        icon: "favorite",
        persist: true,
        more_info_uri: "mailto:eysure@gmail.com?subject=Feedback of AquariusOS",
        more_info_button: ["Email", "发邮件"]
    },
    LOGIN_SUCCESSFUL: {
        title: ["Welcome back, ${username}", "欢迎回来, ${username}"],
        class: 2,
        icon: "favorite"
    },
    LOGIN_FAILED: {
        title: ["Login failed", "登陆失败"],
        content: "${content}",
        class: 5,
        persist: true,
        more_info_uri: "${moreUri}",
        more_info_button: "${moreButton}"
    },
    LOGOUT_OK: { title: ["Logout successfully", "注销成功"], class: 2 },
    LOGOUT_ERR: {
        title: ["Logout Error", "注销错误"],
        content: "${error}",
        class: 5,
        persist: true
    },
    SERVER_LOG_OUT: {
        title: ["You are logoutd out", "你已被登出"],
        content: [
            "This may because the administrators logged you out, or your major information has been changed (e.g. password). Please login again.",
            "这可能是因为管理员将你登出，或你的主要个人信息发生了更改(如密码)，请重新登陆"
        ],
        class: 1,
        persist: true
    },
    FILE_UPLOADING: {
        key: "${key}",
        title: ["File uploading", "文件上传中"],
        progressBar: true,
        hideClose: true
    },
    FILE_UPLOADED: {
        key: "${key}",
        title: ["File uploaded", "文件上传完毕"],
        class: 2
    },
    FILE_UPLOAD_FAILED_FORMAT: {
        key: "${key}",
        title: ["File upload failed", "文件上传失败"],
        content: [
            "File type *.${ext} is not supported yet. \nAcceptable file type: ${acceptableFileFormat}",
            "文件类型 *.${ext} 不支持。\n支持的文件类型有 ${acceptableFileFormat}"
        ],
        class: 5,
        persist: true
    },
    FILE_UPLOAD_FAILED_SIZE: {
        key: "${key}",
        title: ["File upload failed", "文件上传失败"],
        content: [
            "File Size exceeds the maximum upload size. \nYour file size: ${fileSize} MB.\nMaximum file size supported: ${maxFileSize} MB.",
            "文件大小超过最大上传大小. \n此文件大小: ${fileSize} MB.\n支持的最大文件大小: ${maxFileSize} MB."
        ],
        class: 5,
        persist: true
    },
    APP_NOT_READY: {
        title: ["This app is still developing", "此应用正在开发中"],
        content: ["All we provide is the concept and demo. Though, you are welcome to drop a feedback.", "目前提供的仅是概念与展示，同时欢迎提供反馈建议"],
        class: 3,
        persist: true,
        more_info_uri: "mailto:eysure@gmail.com",
        more_info_button: ["Email", "发邮件"]
    },
    APP_LAUNCH_FAILED: {
        title: ["App launch failed", "应用启动失败"],
        content: ["${msgContent}\n\nYou can send this message to Henry and ask for help.", "${msgContent}\n\n你可以向Henry报告这一信息并求助"],
        class: 5,
        persist: true,
        more_info_uri: "mailto:eysure@gmail.com?subject=App launch failed&body=${msgContent}",
        more_info_button: ["Email", "发邮件"]
    },
    APP_CRASH: {
        title: ["App Crash", "应用已意外停止"],
        content: ["${msgContent}\n\nYou can send this message to Henry and ask for help.", "${msgContent}\n\n你可以向Henry报告这一信息并求助"],
        class: 5,
        persist: true,
        more_info_uri: "mailto:eysure@gmail.com?subject=App Crash&body=${msgContent}",
        more_info_button: ["Email", "发邮件"]
    },
    WHATS_LOREM_IPSUM: {
        title: "What's Lorem Ipsum?",
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        progressBar: true,
        persist: true
    },
    NOT_AUTHORIZED_LOGIN: {
        title: ["Login Permission Denied", "缺少登陆权限"],
        content: ["You are logged out. Please contact admins for details.", "您已被登出。请与管理员联系。"],
        class: 5,
        persist: true
    },
    APPLICATION_PERMISSION_DENIED: {
        title: ["Application Permission Denied", "缺少应用权限"],
        content: ["You have no authority to use this application, please contact admins for details.", "您无权使用此应用，请与管理员联系"],
        class: 5,
        persist: true
    }
};
