const nodemailer = require("nodemailer");
const path = require("path");
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USERNAME,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    accessToken: process.env.GMAIL_ACCESS_TOKEN
  }
});

async function sendEmail(mailOptions) {
  return await transporter.sendMail({
    ...mailOptions,
    from: process.env.GMAIL_USERNAME
  });
}

exports.sendShareLinkEmail = async ({ recipientEmail, payload }) => {
  const { videoName } = payload;
  const ejsPath = path.join(__dirname, "templates", "ShareLinkEmail.html");
  const templateEjs = await readFile(ejsPath, "utf-8");
  const renderedHtml = ejs.render(templateEjs, {
    payload: { ...payload }
  });
  const mailOptions = {
    to: recipientEmail,
    subject: `Chimmy YTDL - ${videoName}`,
    html: renderedHtml
  };
  await sendEmail(mailOptions);
};
