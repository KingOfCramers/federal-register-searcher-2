const download = require("download");
const path = require("path");
const { today } = require("../keys/globals");

const limiter = require("../limiter");
const writeFile = require("../writeFile");

function downloader(res) { // Returns an array of promises...
  console.log("downloading files...\n")
  if(res.data.count === 0) {
    return Promise.reject("NO DATA FOR CURRENT DATE.")
  }

  const downloadNonRules = res.data.results.filter(item => (item.type !== "Rule" && item.type !== "Proposed Rule")).map(item => limiter(() => //// This is where we could include a user filter option...
    download(item.pdf_url)
      .then(data => writeFile(`${path.resolve(__dirname, "../")}/${today}/other/${item.agencies[0].raw_name.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}/${item.pdf_file_name}`, data))
    ));

  const downloadRules = res.data.results.filter(item => (item.type === "Rule" || item.type === "Proposed Rule")).map(item => limiter(() => //// This is where we could include a user filter option...
    download(item.pdf_url)
      .then(data => writeFile(`${path.resolve(__dirname, "../")}/${today}/rules/${item.agencies[0].raw_name.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}/${item.pdf_file_name}`, data))
    ));

  return Promise.all(downloadNonRules, downloadRules)
};

module.exports = downloader;