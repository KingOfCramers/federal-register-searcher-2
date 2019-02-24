// Preset Modules...
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config(); // Configure for Google Cloud...

// Global/Multi modules...
const { today } = require("./keys/globals");
const { logger } = require("./logger");

// Sequence modules...
const downloader = require("./downloader");
const settingScraper = require("./settings");
const { fbDaemon } = require("./firebase");
const zipper = require("./zipper");
const cloudUploader = require("./cloudUploader");
const { mailer } = require("./mailer");
const { success, failure } = require("./results");


logger.write(`\nStarting download for: ${today}, at ${Date.now()}`);

axios.get(`http://federalregister.gov/api/v1/public-inspection-documents.json?conditions%5Bavailable_on%5D=${today}`)
  .then(downloader)
  .then(settingScraper)
  .then(fbDaemon) // Should pass down array structure, like in config file.
  .then(zipper)
  .then(cloudUploader)
  .then(mailer)
  .then(success)
  .catch(failure)