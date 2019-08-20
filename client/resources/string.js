import countries from "./countries";

export default {
    // Support Languages
    $LANGUAGE: ["en,en-US", "zh,zh-CN"],

    NULL: ["", ""],
    DATE_FORMAT: ["MM/dd/yyyy", "yyyy-MM-dd"],
    COMPANY_NAME: ["AquariusOS", "AquariusOS"],
    LOADING: ["Loading...", "载入中..."],
    NEW_MESSAGE: ["New Message", "新消息"],
    LOGIN: ["Login", "登录"],
    LOGOUT: ["Logout", "注销"],
    LOGOUT_WITH_NAME: [args => `Log Out ${args.user}...`, args => `注销 ${args.user}...`],
    SWITCH_USER: ["Switch User", "切换用户"],
    ENTER_PASSWORD: ["Enter Password", "输入密码"],
    DONE: ["DONE", "完成"],

    MA_NC_BTN: ["Notification Cetner", "消息中心"],
    PEOPLE: ["People", "个人信息"],
    JOB: ["My Job", "我的工作"],
    PAUSE: ["Pause", "暂停"],
    INTERNSHIP: ["Internship", "实习"],
    PROBATION: ["Probation", "试用"],
    FULL_TIME: ["Full-time", "全职"],
    PART_TIME: ["Part-time", "兼职"],
    INVALID_JOB_TYPE: ["Invalid job type", "职位种类无效"],
    CONTACT: ["Contact", "联系方式"],
    CONNECTION_FAILED: ["Connection Failed", "服务器连接失败"],
    CONNECTION_FAILED_DETAIL: [
        `Sorry, we failed to connect to server, or server has internal errors. Please refresh the page, or check the Internet connection, if it doesn't work, please contact Henry.`,
        "很抱歉, 连接服务器失败了, 或许是服务器上有些错误. 请刷新页面, 或者检查是不是网断了, 如果都不奏效, 请联系Henry"
    ],
    LOGIN_FAILED_INVALID_INPUT: ["Email or passowrd is empty. Check your input and login again.", "邮箱或密码为空，请检查输入并重试"],
    LOGIN_FAILED_WRONG_PASSWORD: [
        "Account not found or password is incorrect. please double check and try again. If you forget your password, please contact Kivi.",
        "用户名不存在或密码错误，请确认后重试。如果忘记密码，请联系Kivi。"
    ],
    LOGIN_FAILED_NETWORK: [
        "Network error has occurred. This may occur when timeout, interrupted connection or unreachable host. Please check the Internet connection.",
        "发生了网络错误。可能是超时，连接被中断，或是无法连接服务器。请检查网络连接。"
    ],
    LOGIN_FAILED_TOO_MANY_REQUESTS: ["Too many unsuccessful login attempts. Please try again later.", "登陆失败次数过多，为了保护账户，请稍后再试"],
    LOGIN_FAILED_DISABLED: [
        "This user is been disabled. We can't let this user login right now. If you need help, please contact Kivi.",
        "此用户已被禁用，目前无法正常登陆。如果需要帮助，请联系Kivi。"
    ],
    LOGIN_FAILED_NO_EMPLOYEE: [
        "No employee info found by this account. Make sure your account email and employee info's email is matched.",
        "找不到员工信息。请确认账户邮箱与员工邮箱匹配。"
    ],
    WELCOME: ["Welcome", "欢迎"],
    EMAIL: ["Email", "邮箱"],
    PASSWORD: ["Password", "密码"],

    SEARCH_BAR_PLACEHOLDER: ["Search anything...", "搜索..."],
    SERVER_RUN_ON: ["Server address", "服务器地址"],
    VERSION: ["Version", "版本"],
    EDIT: ["Edit", "编辑"],
    DELETE: ["Delete", "删除"],
    CANCEL: ["Cancel", "取消"],
    SAVE: ["Save", "保存"],
    PRINT: ["Print", "打印"],
    BOOKMARK: ["Bookmark", "收藏"],
    SYSTEM: ["System", "系统"],
    INVALID_DATE: ["Invalid date", "请输入正确的日期"],
    REFRESH: ["Refresh", "刷新"],
    CHANGE_DESKTOP_BACKGROUND: ["Change Desktop Background", "更改桌面背景"],
    LAUNCHPAD: ["Launchpad", "Launchpad"],

    NAME: ["Name", "姓名"],
    ENG_FN: ["First Name", "First Name"],
    ENG_MN: ["Middle Name", "Middle Name"],
    ENG_LN: ["Last Name", "Last Name"],
    NICKNAME: ["Nickname", "昵称"],
    MOBILE: ["Mobile", "手机"],
    EXT: ["Ext", "分机号"],

    JOB_INFO: ["Job Info", "工作信息"],
    DEPARTMENT: ["Department", "部门"],
    GROUP: ["Group", "组"],
    JOB_TITLE: ["Job Title", "职称"],
    TIME_START: ["Start From", "开始时间"],
    TIME_END: ["Time End", "结束时间"],
    JOB_TYPE: ["Job Type", "工作性质"],

    EMPTY_MENU: ["<Empty Menu>", "<空>"],
    RECENTLY_USED_APPS: ["Recently Used Apps", "常用应用"],
    NONE: ["None", "无"],
    SEARCH: ["Search", "搜索"],

    // Menu Bar Menu
    FILE: ["File", "文件"],
    VIEW: ["View", "视图"],
    WINDOW: ["Window", "窗口"],
    HELP: ["Help", "帮助"],

    UNDER_CONSTRUCTION: ["Under Contruction...", "施工中..."],

    RAW_DATA: ["Raw Data", "原始数据"],

    // Cardinal
    CARDINAL_PH: ["Cardinal Search...", "搜索..."],

    // Notification
    NOTIFICATION_DEFAULT_TITLE: ["Notification", "通知"],

    ...countries
};
