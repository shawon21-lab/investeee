import nodemailer from "nodemailer";
import nextLogger from "./logger";

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
  company: CompanyProps
) => {
  try {
    let transporter = nodemailer.createTransport({
      host: company.emailSetup.host,
      port: company.emailSetup.port,
      secure: company.emailSetup.secure,
      auth: {
        user: company.emailSetup.auth.user,
        pass: company.emailSetup.auth.pass,
      },
    });

    let info = await transporter.sendMail({
      from: company.emailSetup.from, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    nextLogger.info(`Message sent: %s", ${info.messageId}`);
    return `"Message sent: %s", ${info.messageId})`;
  } catch ({ message }: any) {
    nextLogger.error(message);
  }
};

export default sendEmail;

// const sendEmailText = async (
//   to: string,
//   subject: string,
//   text: string,
//   html: string,

//   company: CompanyProps
// ) => {
//   try {
//     let transporter = nodemailer.createTransport({
//       host: "smtp.zoho.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: "Paywander@zohomail.com",
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     let info = await transporter.sendMail({
//       from: '"paywander@zohomail.com"', // sender address
//       to, // list of receivers
//       subject, // Subject line
//       text, // plain text body
//       html, // html body
//     });

//     console.log("Message sent: %s", info.messageId);
//     return `"Message sent: %s", ${info.messageId})`;
//   } catch ({ message }: any) {
//     throw new Error(message);
//   }
// };
