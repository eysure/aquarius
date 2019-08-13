export default {
    1000: {
        code: 1000,
        reason: "No system default auth founded."
    },
    1001: {
        code: 1001,
        reason: "No user found in users collection."
    },
    1002: {
        code: 1002,
        reason: "Cannot find OSS Auth in system collection."
    },
    1003: {
        code: 1003,
        reason: "Provided OSS Auth is not valid."
    },
    1004: {
        code: 1004,
        reason: "Cannot find Email Server in system collection."
    },
    1005: {
        code: 1005,
        reason: "Cannot find Email Server Account in system collection."
    },
    1006: {
        code: 1006,
        reason: "Cannot connect to Email server using provided account."
    }
};

export const httpCode = {
    400: {
        status: 400,
        reason: "Bad Request"
    },
    401: {
        status: 401,
        reason: "Unauthorized"
    },
    403: {
        status: 403,
        reason: "Forbidden"
    },
    404: {
        status: 404,
        reason: "Not Found"
    },
    405: {
        status: 405,
        reason: "Method Not Allowed"
    }
};
