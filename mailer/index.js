const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const config = require("../keys/config");
const { today } = require("../keys/globals");
const path = require("path");
const { logger } = require("../logger");
const cloudUploader = require("../cloudUploader");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    type: "OAuth2",
    user: config.auth.user,
    clientId: config.auth.clientId,
    clientSecret: config.auth.clientSecret,
    refreshToken: config.auth.refreshToken
  }
});

const mailer = (res) => {
    console.log("Emailing files...\n")

    const promises = res.map((result) => {
      email = null, downloadLink = null;
      if (result.constructor === Array){
        email = result[2];
        downloadLink = `https://storage.googleapis.com/federal-register.appspot.com/${result[0][1].name}`;
      }

      if(email && downloadLink){
        let HelperOptions = {
          from: 'FEDERAL REGISTER <hcramer@nationaljournal.com>',
          to: "harrisoncramer@gmail.com",
          subject: `ARCHIVE FOR: ${today}`,
          text: `Your federal register archive is available for download: ${downloadLink} \n\n\n To manage you preferences, head to dcddocs.app`
        };
        return transporter.sendMail(HelperOptions);
      } else {
        email = result;
        return Promise.resolve({ accepted: ["No update"], email });
      }
    });
    return Promise.all(promises)
}

module.exports = { mailer, transporter };