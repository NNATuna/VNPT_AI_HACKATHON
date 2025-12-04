import nodemailer from "nodemailer";

export type ReportPayload = {
  to: string;
  subject: string;
  html: string;
};

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendEmail(payload: ReportPayload) {
    if (!process.env.SMTP_USER) {
      console.info("[MockEmail]", payload.subject, payload.to);
      return { mocked: true };
    }
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    return { mocked: false };
  }
}
