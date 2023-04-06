import chalk from "chalk";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import { __dirname } from "../app.js";
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CLIENT_CALLBACK_URL
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: "v1",
  auth: oAuth2Client,
});

export async function getReplyToCurrentEmails(req, res) {
  try {
    const { data } = await gmail.users.messages.list({
      userId: req.user.id,
      q: "after:2023/04/04 before:2023/05/04 is:inbox label:unread category:primary -in:chats -from:me -subject:Re: -subject:Fwd:",
      maxResults: 10,
    });
    const emails = data.messages;
    if (emails.length == 0) {
      res.send("No Email found");
      return;
    }
    emails.forEach(async (email) => {
      const message = await gmail.users.messages.get({
        userId: req.user.id,
        id: email.id,
      });
      const headers = message.data.payload.headers;
      if (
        headers.filter((header) => header.name === "In-Reply-To").length === 0
      ) {
        const to = headers.find((header) => header.name === "To").value;
        const from = headers.find((header) => header.name === "From").value;
        const subject = headers.find(
          (header) => header.name === "Subject"
        ).value;

        const text =
          "Thank you for your email. I am on a Vacation for some dayzz. Will reach out to you as soon as possible. This is an automated response.";
        const mailOptions = {
          from: req.user.emails[0].value,
          to: from,
          subject: `RE: ${subject}`,
          text: text,
          replyTo: to,
          references: `<${message.data.id}>`,
        };
        const transport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            type: "OAuth2",
            user: req.user.emails[0].value,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: process.env.ACCESS_TOKEN,
          },
        });
        await transport.sendMail(mailOptions);
        console.log(chalk.yellow(`mail delivered to : ${to}`));
      }
    });
    res.sendFile(__dirname + "/index.html");
  } catch (e) {
    console.log(chalk.red(`error : ${e}`));
    res.send(e);
  }
}
