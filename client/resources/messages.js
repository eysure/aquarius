import React from "react";
import ReactJson from "react-json-view";

export default {
    $LANGUAGE: ["en,en-US", "zh,zh-CN"],
    DEMO_WELCOME: [
        {
            title: "Welcome to AquariusOS",
            content: "This is a demo of AquariusOS, test account is provided. Please enjoy! And you are always welcome to drop a feedback.",
            class: 2,
            icon: "favorite",
            persist: true,
            more_info_uri: "mailto:eysure@gmail.com?subject=Feedback of AquariusOS",
            more_info_button: "Email"
        },
        {
            title: "欢迎使用 AquariusOS",
            content: "您现在看到的是演示版的AquariusOS, 请尽情使用！欢迎提供反馈意见。",
            class: 2,
            icon: "favorite",
            persist: true,
            more_info_uri: "mailto:eysure@gmail.com?subject=Feedback of AquariusOS",
            more_info_button: "发邮件"
        }
    ],
    LOGIN_SUCCESSFUL: [
        args => {
            return {
                title: `Welcome back, ${args.username}`,
                class: 2,
                icon: "favorite"
            };
        },
        args => {
            return {
                title: `欢迎回来, ${args.username}`,
                class: 2,
                icon: "favorite"
            };
        }
    ],
    LOGIN_FAILED: [
        args => {
            return {
                title: "Login failed",
                content: args.content,
                class: 5,
                persist: true,
                more_info_uri: args.moreUri,
                more_info_button: args.moreButton
            };
        },
        args => {
            return {
                title: "登录失败",
                content: args.content,
                class: 5,
                persist: true,
                more_info_uri: args.moreUri,
                more_info_button: args.moreButton
            };
        }
    ],
    LOGOUT_OK: [{ title: "Logout successfully", class: 2 }, { title: "注销成功", class: 2 }],
    LOGOUT_ERR: [
        args => {
            return {
                title: "Logout Error",
                content: args.error,
                class: 5,
                persist: true
            };
        },
        args => {
            return {
                title: "注销错误",
                content: args.error,
                class: 5,
                persist: true
            };
        }
    ],
    SERVER_LOG_OUT: [
        {
            title: "You are logoutd out",
            content: "This may because the administrators logged you out, or your major information has been changed (e.g. password). Please login again.",
            class: 1,
            persist: true
        },
        {
            title: "你已被登出",
            content: "这可能是因为管理员将你登出，或你的主要个人信息发生了更改(如密码)，请重新登陆",
            class: 1,
            persist: true
        }
    ],
    FILE_UPLOADING: [
        args => {
            return {
                key: args.key,
                title: "File uploading",
                pending: true,
                hideClose: true
            };
        },
        args => {
            return {
                key: args.key,
                title: "文件上传中",
                pending: true,
                hideClose: true
            };
        }
    ],
    FILE_UPLOADED: [
        args => {
            return {
                key: args.key,
                title: "File uploaded",
                class: 2
            };
        },
        args => {
            return {
                key: args.key,
                title: "文件上传完毕",
                class: 2
            };
        }
    ],
    FILE_UPLOAD_FAILED: [
        args => {
            return {
                key: args.key,
                title: "File upload failed",
                content: args.error,
                class: 5,
                persist: true
            };
        },
        args => {
            return {
                key: args.key,
                title: "文件上传失败",
                content: args.error,
                class: 5,
                persist: true
            };
        }
    ],
    // FILE_UPLOAD_FAILED_FORMAT: {
    //     key: "${key}",
    //     title: ["File upload failed", "文件上传失败"],
    //     content: [
    //         "File type *.${ext} is not supported yet. \nAcceptable file type: ${acceptableFileFormat}",
    //         "文件类型 *.${ext} 不支持。\n支持的文件类型有 ${acceptableFileFormat}"
    //     ],
    //     class: 5,
    //     persist: true
    // },
    // FILE_UPLOAD_FAILED_SIZE: {
    //     key: "${key}",
    //     title: ["File upload failed", "文件上传失败"],
    //     content: [
    //         "File Size exceeds the maximum upload size. \nYour file size: ${fileSize} MB.\nMaximum file size supported: ${maxFileSize} MB.",
    //         "文件大小超过最大上传大小. \n此文件大小: ${fileSize} MB.\n支持的最大文件大小: ${maxFileSize} MB."
    //     ],
    //     class: 5,
    //     persist: true
    // },
    APP_LAUNCH_FAILED: [
        args => {
            return {
                title: "App launch failed",
                content: args.msgContent,
                class: 5,
                persist: true,
                more_info_uri: `mailto:eysure@gmail.com?subject=App launch failed&body=${args.msgContent}`,
                more_info_button: "Email"
            };
        },
        args => {
            return {
                title: "应用启动失败",
                content: args.msgContent,
                class: 5,
                persist: true,
                more_info_uri: `mailto:eysure@gmail.com?subject=App launch failed&body=${args.msgContent}`,
                more_info_button: "Email"
            };
        }
    ],
    APP_CRASH: [
        args => {
            return {
                title: "App stoped unexpected",
                class: 5,
                persist: true,
                more_info_uri: `mailto:eysure@gmail.com?subject=App launch failed&body=${args.msgContent}`,
                more_info_button: "Email",
                raw: args.raw
            };
        },
        args => {
            return {
                title: "应用已意外停止",
                class: 5,
                persist: true,
                more_info_uri: `mailto:eysure@gmail.com?subject=App launch failed&body=${args.msgContent}`,
                more_info_button: "Email",
                raw: args.raw
            };
        }
    ],
    WHATS_LOREM_IPSUM: [
        {
            title: "What's Lorem Ipsum?",
            content:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            pending: true,
            persist: true
        },
        {
            title: "什么是 Lorem Ipsum?",
            content:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            pending: true,
            persist: true
        }
    ],
    OPD: [
        args => {
            return {
                key: args.key,
                title: "Operation Permission Denied",
                content: (
                    <div>
                        You don't have the permission<code>{args.reason}</code>to {args.operation || "operate"}.
                    </div>
                ),
                class: 5,
                persist: true,
                raw: args
            };
        },
        args => {
            return {
                key: args.key,
                title: "未授权的操作",
                content: (
                    <div>
                        你缺少权限<code>{args.requiredAuth}</code>以进行{args.operation || "此操作"}。
                    </div>
                ),
                class: 5,
                persist: true,
                raw: args
            };
        }
    ],
    ERR: [
        args => {
            return {
                key: args.key,
                title: "An Error Occured",
                content: args.err,
                class: 5,
                persist: true,
                raw: args
            };
        },
        args => {
            return {
                key: args.key,
                title: "发生了一个错误",
                content: args.err,
                class: 5,
                persist: true,
                raw: args
            };
        }
    ],
    SERVER_ERROR: [args => renderServerError(args)[0], args => renderServerError(args)[1]],
    SAVED: [
        {
            title: "Saved",
            class: 2
        },
        {
            title: "已保存",
            class: 2
        }
    ],
    DELETED: [
        {
            title: "Deleted",
            class: 2
        },
        {
            title: "已删除",
            class: 2
        }
    ]
};

function renderServerError(args) {
    let title = ["Server Error", "服务器错误"];
    let content = ["", ""];
    switch (args.error) {
        case 400: {
            title = ["Bad Request", "无效的请求或参数错误"];
            break;
        }
        case 401: {
            title = ["Unauthorized", "凭证错误"];
            content = [
                "You could be not logged in, or login environment is not safe. Please logout and try again.",
                "您可能未登录，或登陆环境异常。请注销后重试"
            ];
            break;
        }
        case 403: {
            title = ["Operation Permission Denied", "未授权的操作"];
            content = [
                <div key={0}>
                    You don't have the permission<code>{args.reason}</code>to {args.operation || "operate"}.
                </div>,
                <div key={1}>
                    你缺少权限<code>{args.reason}</code>以进行{args.operation || "此操作"}。
                </div>
            ];
            break;
        }
        case 404: {
            title = ["Not Found", "资源未找到"];
            content = ["The server can not find requested resource.", "请求失败，请求所希望得到的资源未被在服务器上发现。"];
            break;
        }
        default:
            break;
    }

    return [
        {
            key: args.key,
            title: title[0],
            content: content[0],
            class: 5,
            persist: true,
            raw: args
        },
        {
            key: args.key,
            title: title[1],
            content: content[1],
            class: 5,
            persist: true,
            raw: args
        }
    ];
}
