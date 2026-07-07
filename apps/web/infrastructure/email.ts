import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;
  
  await transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email",
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/reset?token=${token}`;
  
  await transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset your password",
    html: `<p>Click <a href="${url}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  });
}
