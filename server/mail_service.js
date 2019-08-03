import nodemailer from "nodemailer";

let instance = null;

export default class MailService {
    transporter = null;
    from = null;
    defaultSubject = null;

    constructor(mailServer, mailSender) {
        if (instance) return instance;
        instance = this;
        this.transporter = nodemailer.createTransport({
            host: mailServer.smtp_host,
            port: mailServer.smtp_port_ssl,
            secure: true,
            auth: {
                user: mailSender.user,
                pass: mailSender.pass
            }
        });
        this.from = `"${mailSender.name}" <${mailSender.user}>`;
        this.defaultSubject = mailSender.defaultSubject;
        return instance;
    }

    static send = (option, callback = null) => {
        if (!instance || !instance.transporter) {
            console.error("Mail Transporter is not initialized yet. This mail will not send.");
            return;
        }
        if (!option.to) {
            console.error("Mail has to be at least one recipiant. This mail will not send.");
            return;
        }
        if (!option.text) {
            console.error("Mail need a body. This mail will not send.");
            return;
        }
        instance.transporter.sendMail(
            {
                from: option.from || instance.from,
                to: option.to,
                subject: option.subject || instance.defaultSubject,
                text: option.text,
                ...option
            },
            callback
        );
    };
}
