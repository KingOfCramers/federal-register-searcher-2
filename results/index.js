const path = require("path");
const fs = require("fs-extra");
const moment = require("moment");
const util = require("util");

const { logger, errLogger } = require("../logger/index");
const { today } = require("../keys/globals");

let loggerPromise = util.promisify(logger.write);

const { transporter } = require("../mailer");

const success = (info) => {
  const promises = info.map((msg, i) => {
      if(msg.accepted[0] != "No update"){
        let writer = loggerPromise(`\n ${msg.accepted[0]} -- Zip file emailed w/ size ${msg.messageSize}`);
        let deleter = fs.unlink(path.resolve(__dirname, "..", `${msg.accepted[0].substring(0,msg.accepted[0].lastIndexOf("@"))}.zip`));
        return Promise.all([writer,deleter])
      } else {
        return loggerPromise(`\n ${msg.email} -- ${msg.accepted[0]}`)
      }
  });
  return Promise.all(promises).then(() => {
    console.log("DONE");
    // fs.removeSync(path.resolve(__dirname, "..", today));
    process.exit();
  })
}

const failure = async (err) => {
  errLogger.write(`\nERROR: ${today} AT ${moment(Date.now()).format("hh:mm")} -- ${err}`);
  console.log(err)
 let helperOpts = {
    from: 'DCDOCS <hcramer@nationaljournal.com>',
    to: "harrisoncramer@gmail.com",
    subject: `ERROR ON ${today}`,
    text: `ERROR: ${today} AT ${moment(Date.now()).format("hh:mm")} -- ${err}`
  };

  transporter.sendMail(helperOpts, (err, data) => {
    if (err) {
      errLogger.write("\nTOTAL FAIL");
    } else {
      process.exit();
    };
  });
}

module.exports = {
  success,
  failure
};